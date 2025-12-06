// Utility functions for the Stock Tracker app
// These are extracted for testability

/**
 * Validate a single ticker symbol
 * @param {string} ticker - The ticker symbol to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export function isValidTicker(ticker) {
    if (!ticker || typeof ticker !== 'string') {
        return false;
    }
    const cleaned = ticker.trim().toUpperCase();
    return /^[A-Z]{1,5}$/.test(cleaned);
}

/**
 * Parse input string into array of tickers
 * Supports comma-separated and space-separated formats
 * @param {string} input - The input string (e.g., "TSLA, PLTR, ASTS")
 * @returns {string[]} - Array of uppercase ticker symbols
 */
export function parseTickerInput(input) {
    if (!input || typeof input !== 'string') {
        return [];
    }
    return input
        .split(/[,\s]+/)
        .map(t => t.trim().toUpperCase())
        .filter(t => t.length > 0);
}

/**
 * Filter valid tickers from an array
 * @param {string[]} tickers - Array of ticker symbols
 * @returns {{ valid: string[], invalid: string[] }} - Object with valid and invalid tickers
 */
export function filterValidTickers(tickers) {
    const valid = [];
    const invalid = [];
    
    for (const ticker of tickers) {
        if (isValidTicker(ticker)) {
            valid.push(ticker.toUpperCase());
        } else {
            invalid.push(ticker);
        }
    }
    
    return { valid, invalid };
}

/**
 * Check if adding new tickers would exceed the maximum limit
 * @param {number} currentCount - Current number of tickers
 * @param {number} newCount - Number of tickers to add
 * @param {number} maxTickers - Maximum allowed tickers
 * @returns {{ canAdd: number, exceeded: boolean }} - How many can be added and if limit exceeded
 */
export function checkTickerLimit(currentCount, newCount, maxTickers = 3) {
    const availableSlots = maxTickers - currentCount;
    const canAdd = Math.min(newCount, availableSlots);
    const exceeded = newCount > availableSlots;
    
    return { canAdd, exceeded, availableSlots };
}

/**
 * Remove duplicate tickers from array
 * @param {string[]} tickers - Array of ticker symbols
 * @param {string[]} existingTickers - Already tracked tickers
 * @returns {string[]} - Array with duplicates removed
 */
export function removeDuplicateTickers(tickers, existingTickers = []) {
    const existingSet = new Set(existingTickers.map(t => t.toUpperCase()));
    const seen = new Set();
    const unique = [];
    
    for (const ticker of tickers) {
        const upper = ticker.toUpperCase();
        if (!existingSet.has(upper) && !seen.has(upper)) {
            seen.add(upper);
            unique.push(upper);
        }
    }
    
    return unique;
}

/**
 * Validate stock data response from Polygon.io
 * @param {object} data - The API response data
 * @returns {{ isValid: boolean, error: string | null }}
 */
export function validateStockData(data) {
    if (!data) {
        return { isValid: false, error: 'No data received' };
    }
    
    if (data.resultsCount === 0 || !data.results || data.results.length === 0) {
        return { isValid: false, error: 'Ticker not found or has no data' };
    }
    
    return { isValid: true, error: null };
}
