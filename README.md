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

## Getting Started

### Prerequisites

- A free [Polygon.io](https://polygon.io/) account and API key
- A modern web browser

### API Setup

1. **Get your Polygon.io API Key:**
   - Go to [Polygon.io](https://polygon.io/) and create a free account
   - Navigate to your dashboard and copy your API key

2. **Create the config file:**
   
   Create a new file called `config.js` in the root directory with the following content:

   ```javascript
   // config.js
   // API Configuration - This file is gitignored
   
   export const config = {
       POLYGON_API_KEY: 'your_polygon_api_key_here'
   };
   ```

   Replace `'your_polygon_api_key_here'` with your actual Polygon.io API key.

   **Reference:** The `config.example.js` file shows the expected structure:

   ```javascript
   // config.example.js
   // API Configuration - DO NOT COMMIT THIS FILE
   // Copy this file to config.js and add your real API keys
   
   export const config = {
       POLYGON_API_KEY: 'your_polygon_api_key_here'
   };
   ```

> ⚠️ **Important:** Never commit `config.js` to version control. It's already in `.gitignore` to protect your API key.

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
