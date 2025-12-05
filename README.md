> ⚠️ **Disclaimer:** This application is for educational and research purposes only. Stock predictions are not financial advice. Always do your own research before making investment decisions.

# Shifty Sam's Stock Tracker

A JavaScript-based AI application for predicting stock prices.

## Overview

This project uses artificial intelligence and machine learning techniques to analyze historical stock data and predict future price movements.

> Note: his project has been created using Vibe Coding with Claude - Opus 4.5

## Features

- 📈 Stock price prediction using ML models
- 📊 Historical data analysis
- 🤖 AI-powered forecasting

## Tech Stack

- **Language:** JavaScript
- **Stock Data:** [Polygon.io](https://polygon.io/) API
- **AI:** OpenAI API

## High Level System Design

```
┌─────────────────┐                      ┌─────────────────┐
│                 │                      │                 │
│   TSLA, META    │                      │   THE REPORT    │
│                 │                      │                 │
└────────┬────────┘                      └────────▲────────┘
         │                                        │
         │                                        │
         ▼                                        │
┌─────────────────┐                      ┌────────┴────────┐
│                 │                      │                 │
│   Polygon.io    │ ──────────────────▶  │    OpenAI       │
│   Stock API     │                      │                 │
│                 │                      │                 │
└─────────────────┘                      └─────────────────┘
```

**Flow:**
1. User provides stock symbols (e.g., TSLA, META)
2. Polygon.io API fetches historical stock data
3. Data is sent to OpenAI for analysis
4. OpenAI generates the prediction report

## OpenAI Messages Array

```
                    ┌─────────────────────────────┐
                    │      Messages Array         │
                    │                             │
 instructions ────▶ │  ┌───────────────────────┐  │        ┌─────────────────┐
                    │  │      { system }       │  │        │                 │
                    │  └───────────────────────┘  │ ─────▶ │     OpenAI      │
                    │  ┌───────────────────────┐  │        │                 │
 user's input ────▶ │  │       { user }        │  │        └────────┬────────┘
                    │  └───────────────────────┘  │                 │
                    │                             │                 ▼
                    └─────────────────────────────┘        ┌─────────────────┐
                                                           │                 │
                                                           │  { assistant }  │
                                              AI output ◀──│                 │
                                                           └─────────────────┘
```

**Message Roles:**
- **system**: Instructions that define how the AI should behave and analyze stock data
- **user**: The stock data from Polygon.io that needs to be analyzed
- **assistant**: The AI-generated prediction report returned to the user

## Getting Started

### Prerequisites

- A free [Polygon.io](https://polygon.io/) account and API key
- A modern web browser

### API Setup

#### 1. Get your Polygon.io API Key
   - Go to [Polygon.io](https://polygon.io/) and create a free account
   - Navigate to your dashboard and copy your API key

#### 2. Get your OpenAI API Key
   - Go to [OpenAI Platform](https://platform.openai.com/) and sign up or log in
   - Navigate to **API Keys** section: https://platform.openai.com/api-keys
   - Click **"Create new secret key"**
   - Give it a name (e.g., "Shifty Sam's Stock Tracker")
   - Copy the key immediately (you won't be able to see it again!)

#### 3. Create the config file
   
   You have two options:

   **Option A: Copy the example file (Recommended)**
   ```bash
   cp config.example.js config.js
   ```
   Then open `config.js` and replace the placeholder values with your actual API keys.

   **Option B: Create manually**
   
   Create a new file called `config.js` in the root directory with the following content:

   ```javascript
   // config.js
   // API Configuration - This file is gitignored
   
   export const config = {
       POLYGON_API_KEY: 'your_polygon_api_key_here',
       OPENAI_API_KEY: 'your_openai_api_key_here'
   };
   ```

   Replace the placeholder values with your actual API keys.

> ⚠️ **Important:** Never commit `config.js` to version control. It's already in `.gitignore` to protect your API keys.

### Installation

```bash
# Clone the repository
git clone https://github.com/ouchsaray/ai_stock_trader.git

# Navigate to project directory
cd ai_stock_trader
```

Then create your `config.js` file following the API Setup instructions above.

### Usage

Open `index.html` in your browser, or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js (npx)
npx serve
```

Then open http://localhost:8000 in your browser.

## Project Structure

```
ai_trader/
├── README.md
└── ... (more to come)
```

## License

This project is licensed under the MIT License.

---
