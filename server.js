const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// Use a different free API that doesn't require authentication
const API_BASE = 'https://api.exchangerate-api.com/v4/latest';

// Proxy endpoint for latest rates
app.get('/api/latest', async (req, res) => {
  const { base, symbols } = req.query;
  const url = `${API_BASE}/${base}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    // Transform the response to match the expected format
    if (data && data.rates) {
      const filteredRates = {};
      if (symbols) {
        const symbolList = symbols.split(',');
        symbolList.forEach(symbol => {
          if (data.rates[symbol]) {
            filteredRates[symbol] = data.rates[symbol];
          }
        });
      } else {
        filteredRates = data.rates;
      }
      
      res.json({
        success: true,
        base: data.base,
        rates: filteredRates,
        date: data.date
      });
    } else {
      res.status(500).json({ error: 'Invalid response from API' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch latest rates' });
  }
});

// Proxy endpoint for currency conversion
app.get('/api/convert', async (req, res) => {
  const { from, to, amount } = req.query;
  const url = `${API_BASE}/${from}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data && data.rates && data.rates[to]) {
      const rate = data.rates[to];
      const result = parseFloat(amount) * rate;
      
      res.json({
        success: true,
        result: result,
        rate: rate,
        from: from,
        to: to,
        amount: parseFloat(amount)
      });
    } else {
      res.status(500).json({ error: 'Invalid conversion parameters' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch conversion result' });
  }
});

// Proxy endpoint for currency symbols (provide a static list since this API doesn't have symbols endpoint)
app.get('/api/symbols', async (req, res) => {
  try {
    // Get latest rates for USD to get all available currencies
    const response = await fetch(`${API_BASE}/USD`);
    const data = await response.json();
    
    if (data && data.rates) {
      const symbols = {};
      Object.keys(data.rates).forEach(currency => {
        symbols[currency] = {
          description: currency,
          code: currency
        };
      });
      
      res.json({
        success: true,
        symbols: symbols
      });
    } else {
      res.status(500).json({ error: 'Failed to fetch symbols' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch symbols' });
  }
});

// Proxy endpoint for historical rates (simplified - this API doesn't have timeseries)
app.get('/api/timeseries', async (req, res) => {
  const { base, symbols } = req.query;
  try {
    // For now, return current rates as historical data
    const response = await fetch(`${API_BASE}/${base}`);
    const data = await response.json();
    
    if (data && data.rates) {
      const today = new Date().toISOString().split('T')[0];
      const rates = {};
      rates[today] = {};
      
      if (symbols) {
        const symbolList = symbols.split(',');
        symbolList.forEach(symbol => {
          if (data.rates[symbol]) {
            rates[today][symbol] = data.rates[symbol];
          }
        });
      } else {
        rates[today] = data.rates;
      }
      
      res.json({
        success: true,
        base: data.base,
        rates: rates
      });
    } else {
      res.status(500).json({ error: 'Failed to fetch historical data' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch timeseries data' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
}); 