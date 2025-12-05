import { dates } from './utils/dates.js'
import { config } from './config.js'

const tickersArr = []
const MAX_TICKERS = 3

// DOM Elements - matching index.html IDs and classes
const generateReportBtn = document.querySelector('.generate-report-btn')
const actionPanel = document.querySelector('.action-panel')
const loadingArea = document.querySelector('.loading-panel')
const apiMessage = document.getElementById('api-message')
const tickersDiv = document.querySelector('.ticker-choice-display')

generateReportBtn.addEventListener('click', fetchStockData)

document.getElementById('ticker-input-form').addEventListener('submit', (e) => {
    e.preventDefault()
    const tickerInput = document.getElementById('ticker-input')
    const label = document.getElementById('ticker-label')
    
    // Parse input - support comma-separated tickers (e.g., "TSLA, PLTR, ASTS")
    const inputValue = tickerInput.value.trim()
    const tickersToAdd = inputValue
        .split(/[,\s]+/) // Split by comma or whitespace
        .map(t => t.trim().toUpperCase())
        .filter(t => t.length > 0) // Remove empty strings
    
    if (tickersToAdd.length === 0) {
        label.style.color = 'red'
        label.textContent = 'Please enter at least one valid ticker symbol.'
        return
    }
    
    // Check how many we can add
    const availableSlots = MAX_TICKERS - tickersArr.length
    
    if (availableSlots <= 0) {
        label.style.color = 'red'
        label.textContent = `Maximum ${MAX_TICKERS} tickers allowed per request.`
        tickerInput.value = ''
        return
    }
    
    // Validate and add tickers
    const invalidTickers = []
    let addedCount = 0
    
    for (const ticker of tickersToAdd) {
        if (addedCount >= availableSlots) {
            label.style.color = '#ffc107'
            label.textContent = `Only ${addedCount} ticker(s) added. Maximum ${MAX_TICKERS} reached.`
            break
        }
        
        // Validate ticker format (1-5 letters)
        if (!/^[A-Z]{1,5}$/.test(ticker)) {
            invalidTickers.push(ticker)
            continue
        }
        
        // Check for duplicates
        if (tickersArr.includes(ticker)) {
            continue // Skip duplicates silently
        }
        
        tickersArr.push(ticker)
        addedCount++
    }
    
    if (invalidTickers.length > 0 && addedCount === 0) {
        label.style.color = 'red'
        label.textContent = `Invalid ticker(s): ${invalidTickers.join(', ')}. Use 1-5 letters (e.g., TSLA).`
        tickerInput.value = ''
        return
    }
    
    if (addedCount > 0) {
        // Reset label
        label.style.color = ''
        label.textContent = 'Enter a stock ticker (max 3):'
        generateReportBtn.disabled = false
        tickerInput.value = ''
        renderTickers()
    }
})

function renderTickers() {
    tickersDiv.innerHTML = ''
    tickersArr.forEach((ticker) => {
        const newTickerSpan = document.createElement('span')
        newTickerSpan.textContent = ticker
        newTickerSpan.classList.add('ticker')
        tickersDiv.appendChild(newTickerSpan)
    })
}

async function fetchStockData() {
    actionPanel.style.display = 'none'
    loadingArea.style.display = 'flex'
    apiMessage.innerText = 'Fetching stock data...'
    
    const invalidTickers = []
    const validStockData = []
    
    try {
        // Fetch data for each ticker individually to track which ones fail
        for (const ticker of tickersArr) {
            apiMessage.innerText = `Fetching data for ${ticker}...`
            const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${dates.startDate}/${dates.endDate}?apiKey=${config.POLYGON_API_KEY}`
            const response = await fetch(url)
            const data = await response.json()
            
            // Check if ticker exists and has results
            if (data.resultsCount === 0 || !data.results || data.results.length === 0) {
                invalidTickers.push(ticker)
            } else if (response.status === 200) {
                validStockData.push({ ticker, data })
            } else {
                invalidTickers.push(ticker)
            }
        }
        
        // If there are invalid tickers, show them to the user
        if (invalidTickers.length > 0 && validStockData.length === 0) {
            throw new Error(`Ticker(s) not found: ${invalidTickers.join(', ')}. Please check the symbol(s) and try again.`)
        }
        
        if (invalidTickers.length > 0 && validStockData.length > 0) {
            // Some tickers are invalid, but we have valid ones - warn and continue
            console.warn(`Invalid tickers skipped: ${invalidTickers.join(', ')}`)
            apiMessage.innerText = `Note: "${invalidTickers.join(', ')}" not found. Generating report for valid tickers...`
            await new Promise(resolve => setTimeout(resolve, 2000)) // Show message for 2 seconds
        }
        
        if (validStockData.length === 0) {
            throw new Error('No valid stock data found for the provided tickers.')
        }
        
        apiMessage.innerText = 'Creating report...'
        fetchReport(validStockData)
    } catch(err) {
        loadingArea.querySelector('p').innerText = err.message || 'There was an error fetching stock data.'
        console.error('error: ', err)
    }
}

async function fetchReport(stockDataArray) {
    apiMessage.innerText = 'Generating AI report...'
    
    // Format data for each ticker
    const formattedData = stockDataArray.map(({ ticker, data }) => {
        return `Stock: ${ticker}\nData: ${JSON.stringify(data)}`
    }).join('\n\n---\n\n')
    
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: `You are a stock market analyst. Analyze the provided stock data and generate a prediction report for EACH stock separately.
                        
                        For EACH stock ticker, include:
                        - Stock name/ticker as a header
                        - Brief summary of recent price movements
                        - Key trends identified
                        - Short-term prediction (next few days)
                        - Risk assessment
                        
                        Make sure to provide a separate analysis section for each stock. Keep the response clear and easy to understand for non-experts.`
                    },
                    {
                        role: 'user',
                        content: `Analyze the following stock data and provide a separate prediction report for each stock:\n\n${formattedData}`
                    }
                ]
            })
        })
        
        const result = await response.json()
        
        if (result.error) {
            if (result.error.code === 'insufficient_quota') {
                throw new Error('OpenAI quota exceeded. Please check your billing at platform.openai.com/account/billing')
            }
            throw new Error(result.error.message)
        }
        
        const report = result.choices[0].message.content
        renderReport(report)
    } catch (err) {
        console.error('OpenAI API error:', err)
        loadingArea.querySelector('p').innerText = err.message || 'Error generating report. Please try again.'
    }
}

function renderReport(output) {
    loadingArea.style.display = 'none'
    const outputArea = document.querySelector('.output-panel')
    const reportContent = document.getElementById('reportContent')
    
    // Format the markdown-style output to HTML
    let formattedOutput = output
        // Convert **bold** to <strong>
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        // Convert headers (lines ending with :) to styled headers
        .replace(/^(#{1,3})\s*(.+)$/gm, '<h3>$2</h3>')
        // Convert bullet points
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        // Wrap consecutive <li> items in <ul>
        .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
        // Convert newlines to breaks for readability
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>')
    
    // Wrap in paragraph if not already structured
    if (!formattedOutput.startsWith('<')) {
        formattedOutput = '<p>' + formattedOutput + '</p>'
    }
    
    reportContent.innerHTML = formattedOutput
    outputArea.style.display = 'flex'
}