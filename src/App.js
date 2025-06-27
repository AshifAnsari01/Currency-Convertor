import React, { useEffect, useState, useCallback, useMemo } from "react";
import Select from "react-select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import "./App.css";

function App() {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [currencies, setCurrencies] = useState([]);
  const [result, setResult] = useState(null);
  const [lastUpdated, setLastUpdated] = useState("");
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [multiCurrencyData, setMultiCurrencyData] = useState([]);
  const [showMultiTable, setShowMultiTable] = useState(false);

  // Currency to country mapping for flags (expanded list) - wrapped in useMemo
  const currencyToCountry = useMemo(() => ({
    // Major currencies
    USD: "US", EUR: "EU", GBP: "GB", JPY: "JP", AUD: "AU", CAD: "CA", CHF: "CH", CNY: "CN", INR: "IN", BRL: "BR",
    MXN: "MX", SGD: "SG", HKD: "HK", KRW: "KR", THB: "TH", NZD: "NZ", SEK: "SE", NOK: "NO", DKK: "DK", PLN: "PL",
    CZK: "CZ", HUF: "HU", RUB: "RU", TRY: "TR", ZAR: "ZA", EGP: "EG", MAD: "MA", TND: "TN", NGN: "NG", GHS: "GH",
    KES: "KE", TZS: "TZ", UGX: "UG", ETB: "ET", ILS: "IL", AED: "AE", SAR: "SA", QAR: "QA", KWD: "KW", BHD: "BH",
    OMR: "OM", JOD: "JO", LBP: "LB", SYP: "SY", IQD: "IQ", IRR: "IR", PKR: "PK", BDT: "BD", LKR: "LK", NPR: "NP",
    BTN: "BT", MVR: "MV", AFN: "AF", KZT: "KZ", UZS: "UZ", KGS: "KG", TJS: "TJ", TMT: "TM", ARS: "AR", CLP: "CL",
    COP: "CO", PEN: "PE", UYU: "UY", VEF: "VE", JMD: "JM", TTD: "TT", BBD: "BB", BZD: "BZ", GYD: "GY", SRD: "SR",
    HTG: "HT", DOP: "DO", CUC: "CU", CUP: "CU", FJD: "FJ", PGK: "PG", SBD: "SB", VUV: "VU", WST: "WS", TOP: "TO",
    XPF: "PF", NIO: "NI", HNL: "HN", GTQ: "GT", SVC: "SV", CRC: "CR", PAB: "PA", DZD: "DZ", LYD: "LY", SDG: "SD",
    XOF: "BF", XAF: "CM", GMD: "GM", SLL: "SL", LRD: "LR", GNF: "GN", BIF: "BI", RWF: "RW", SOS: "SO", DJF: "DJ",
    KMF: "KM", MUR: "MU", SCR: "SC", MGA: "MG", BWP: "BW", NAD: "NA", LSL: "LS", SZL: "SZ", ZMW: "ZM", MWK: "MW",
    MZN: "MZ", ZWL: "ZW", MMK: "MM", LAK: "LA", KHR: "KH", MOP: "MO",
    // Precious metals
    XAU: "XX", XAG: "XX", XPT: "XX", XPD: "XX"
  }), []);

  // Generate realistic mock rates based on current market conditions
  const generateRealisticRates = useCallback((baseCurrency) => {
    const baseRates = {
      USD: { EUR: 0.85, GBP: 0.73, JPY: 110.5, INR: 75.2, AUD: 1.35, CAD: 1.25, CHF: 0.92, CNY: 6.45, BRL: 5.2, MXN: 20.1 },
      EUR: { USD: 1.18, GBP: 0.86, JPY: 130.0, INR: 88.5, AUD: 1.59, CAD: 1.47, CHF: 1.08, CNY: 7.59, BRL: 6.12, MXN: 23.6 },
      GBP: { USD: 1.37, EUR: 1.16, JPY: 151.4, INR: 103.0, AUD: 1.85, CAD: 1.71, CHF: 1.26, CNY: 8.84, BRL: 7.12, MXN: 27.5 },
      JPY: { USD: 0.009, EUR: 0.0077, GBP: 0.0066, INR: 0.68, AUD: 0.012, CAD: 0.011, CHF: 0.0083, CNY: 0.058, BRL: 0.047, MXN: 0.18 },
      INR: { USD: 0.013, EUR: 0.011, GBP: 0.0097, JPY: 1.47, AUD: 0.018, CAD: 0.017, CHF: 0.012, CNY: 0.086, BRL: 0.069, MXN: 0.27 },
      AUD: { USD: 0.74, EUR: 0.63, GBP: 0.54, JPY: 81.9, INR: 55.7, CAD: 0.93, CHF: 0.68, CNY: 4.78, BRL: 3.85, MXN: 14.9 },
      CAD: { USD: 0.80, EUR: 0.68, GBP: 0.58, JPY: 88.4, INR: 60.2, AUD: 1.08, CHF: 0.74, CNY: 5.16, BRL: 4.16, MXN: 16.1 },
      CHF: { USD: 1.09, EUR: 0.93, GBP: 0.79, JPY: 120.1, INR: 81.7, AUD: 1.47, CAD: 1.36, CNY: 7.01, BRL: 5.65, MXN: 21.8 },
      CNY: { USD: 0.155, EUR: 0.132, GBP: 0.113, JPY: 17.1, INR: 11.6, AUD: 0.209, CAD: 0.194, CHF: 0.143, BRL: 0.806, MXN: 3.12 },
      BRL: { USD: 0.192, EUR: 0.163, GBP: 0.140, JPY: 21.3, INR: 14.5, AUD: 0.260, CAD: 0.240, CHF: 0.177, CNY: 1.24, MXN: 3.87 }
    };

    // Add some market variation (±2%)
    const addVariation = (rate) => {
      const variation = (Math.random() - 0.5) * 0.04; // ±2%
      return rate * (1 + variation);
    };

    const rates = {};
    Object.keys(baseRates).forEach(currency => {
      if (currency !== baseCurrency) {
        rates[currency] = addVariation(baseRates[baseCurrency]?.[currency] || 1);
      }
    });

    return rates;
  }, []);

  // Mock exchange rates for offline functionality - wrapped in useMemo
  const mockRates = useMemo(() => ({
    USD: { EUR: 0.85, GBP: 0.73, JPY: 110.5, INR: 75.2, AUD: 1.35, CAD: 1.25, CHF: 0.92, CNY: 6.45, BRL: 5.2, MXN: 20.1 },
    EUR: { USD: 1.18, GBP: 0.86, JPY: 130.0, INR: 88.5, AUD: 1.59, CAD: 1.47, CHF: 1.08, CNY: 7.59, BRL: 6.12, MXN: 23.6 },
    GBP: { USD: 1.37, EUR: 1.16, JPY: 151.4, INR: 103.0, AUD: 1.85, CAD: 1.71, CHF: 1.26, CNY: 8.84, BRL: 7.12, MXN: 27.5 },
    JPY: { USD: 0.009, EUR: 0.0077, GBP: 0.0066, INR: 0.68, AUD: 0.012, CAD: 0.011, CHF: 0.0083, CNY: 0.058, BRL: 0.047, MXN: 0.18 },
    INR: { USD: 0.013, EUR: 0.011, GBP: 0.0097, JPY: 1.47, AUD: 0.018, CAD: 0.017, CHF: 0.012, CNY: 0.086, BRL: 0.069, MXN: 0.27 },
    AUD: { USD: 0.74, EUR: 0.63, GBP: 0.54, JPY: 81.9, INR: 55.7, CAD: 0.93, CHF: 0.68, CNY: 4.78, BRL: 3.85, MXN: 14.9 },
    CAD: { USD: 0.80, EUR: 0.68, GBP: 0.58, JPY: 88.4, INR: 60.2, AUD: 1.08, CHF: 0.74, CNY: 5.16, BRL: 4.16, MXN: 16.1 },
    CHF: { USD: 1.09, EUR: 0.93, GBP: 0.79, JPY: 120.1, INR: 81.7, AUD: 1.47, CAD: 1.36, CNY: 7.01, BRL: 5.65, MXN: 21.8 },
    CNY: { USD: 0.155, EUR: 0.132, GBP: 0.113, JPY: 17.1, INR: 11.6, AUD: 0.209, CAD: 0.194, CHF: 0.143, BRL: 0.806, MXN: 3.12 },
    BRL: { USD: 0.192, EUR: 0.163, GBP: 0.140, JPY: 21.3, INR: 14.5, AUD: 0.260, CAD: 0.240, CHF: 0.177, CNY: 1.24, MXN: 3.87 }
  }), []);

  // Load saved preferences from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("converter"));
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    
    if (saved) {
      setAmount(saved.amount);
      setFromCurrency(saved.from);
      setToCurrency(saved.to);
    }
    
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.body.classList.add("dark-mode");
    }
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem("converter", JSON.stringify({ 
      amount, 
      from: fromCurrency, 
      to: toCurrency 
    }));
  }, [amount, fromCurrency, toCurrency]);

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode.toString());
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  // Test API connection
  useEffect(() => {
    const testAPI = async () => {
      try {
        console.log("Testing API connection...");
        const testRes = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
        console.log("Test API status:", testRes.status);
        if (testRes.ok) {
          const testData = await testRes.json();
          console.log("Test API data:", testData);
        }
      } catch (error) {
        console.error("API test failed:", error);
      }
    };
    testAPI();
  }, []);

  // Flag mapping for dropdowns - using flag images from CDN
  const currencyToFlag = {
    // Major currencies
    USD: "https://flagcdn.com/w20/us.png", EUR: "https://flagcdn.com/w20/eu.png", GBP: "https://flagcdn.com/w20/gb.png", 
    JPY: "https://flagcdn.com/w20/jp.png", AUD: "https://flagcdn.com/w20/au.png", CAD: "https://flagcdn.com/w20/ca.png", 
    CHF: "https://flagcdn.com/w20/ch.png", CNY: "https://flagcdn.com/w20/cn.png", INR: "https://flagcdn.com/w20/in.png", 
    BRL: "https://flagcdn.com/w20/br.png", MXN: "https://flagcdn.com/w20/mx.png", SGD: "https://flagcdn.com/w20/sg.png", 
    HKD: "https://flagcdn.com/w20/hk.png", KRW: "https://flagcdn.com/w20/kr.png", THB: "https://flagcdn.com/w20/th.png", 
    NZD: "https://flagcdn.com/w20/nz.png", SEK: "https://flagcdn.com/w20/se.png", NOK: "https://flagcdn.com/w20/no.png", 
    DKK: "https://flagcdn.com/w20/dk.png", PLN: "https://flagcdn.com/w20/pl.png", CZK: "https://flagcdn.com/w20/cz.png", 
    HUF: "https://flagcdn.com/w20/hu.png", RUB: "https://flagcdn.com/w20/ru.png", TRY: "https://flagcdn.com/w20/tr.png", 
    ZAR: "https://flagcdn.com/w20/za.png", EGP: "https://flagcdn.com/w20/eg.png", MAD: "https://flagcdn.com/w20/ma.png", 
    TND: "https://flagcdn.com/w20/tn.png", NGN: "https://flagcdn.com/w20/ng.png", GHS: "https://flagcdn.com/w20/gh.png",
    KES: "https://flagcdn.com/w20/ke.png", TZS: "https://flagcdn.com/w20/tz.png", UGX: "https://flagcdn.com/w20/ug.png", 
    ETB: "https://flagcdn.com/w20/et.png", ILS: "https://flagcdn.com/w20/il.png", AED: "https://flagcdn.com/w20/ae.png", 
    SAR: "https://flagcdn.com/w20/sa.png", QAR: "https://flagcdn.com/w20/qa.png", KWD: "https://flagcdn.com/w20/kw.png", 
    BHD: "https://flagcdn.com/w20/bh.png", PKR: "https://flagcdn.com/w20/pk.png", BDT: "https://flagcdn.com/w20/bd.png", 
    LKR: "https://flagcdn.com/w20/lk.png", NPR: "https://flagcdn.com/w20/np.png", ARS: "https://flagcdn.com/w20/ar.png", 
    CLP: "https://flagcdn.com/w20/cl.png", COP: "https://flagcdn.com/w20/co.png", PEN: "https://flagcdn.com/w20/pe.png", 
    UYU: "https://flagcdn.com/w20/uy.png", JMD: "https://flagcdn.com/w20/jm.png", MYR: "https://flagcdn.com/w20/my.png", 
    IDR: "https://flagcdn.com/w20/id.png", PHP: "https://flagcdn.com/w20/ph.png", VND: "https://flagcdn.com/w20/vn.png",
    TWD: "https://flagcdn.com/w20/tw.png", RON: "https://flagcdn.com/w20/ro.png", BGN: "https://flagcdn.com/w20/bg.png", 
    HRK: "https://flagcdn.com/w20/hr.png", RSD: "https://flagcdn.com/w20/rs.png", ALL: "https://flagcdn.com/w20/al.png", 
    MKD: "https://flagcdn.com/w20/mk.png", MDL: "https://flagcdn.com/w20/md.png", GEL: "https://flagcdn.com/w20/ge.png",
    AMD: "https://flagcdn.com/w20/am.png", AZN: "https://flagcdn.com/w20/az.png", BYN: "https://flagcdn.com/w20/by.png", 
    MNT: "https://flagcdn.com/w20/mn.png"
  };

  // Fetch currency symbols with fallback
  useEffect(() => {
    fetch("https://api.exchangerate-api.com/v4/latest/USD")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.rates) {
          setCurrencies(Object.keys(data.rates));
        } else {
          setCurrencies([
            "USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY", "INR", "BRL",
            "MXN", "SGD", "HKD", "KRW", "THB", "NZD", "SEK", "NOK", "DKK", "PLN",
            "CZK", "HUF", "RUB", "TRY", "ZAR", "EGP", "MAD", "TND", "NGN", "GHS",
            "KES", "TZS", "UGX", "ETB", "ILS", "AED", "SAR", "QAR", "KWD", "BHD",
            "PKR", "BDT", "LKR", "NPR", "ARS", "CLP", "COP", "PEN", "UYU", "JMD"
          ]);
        }
      })
      .catch(() => {
        // Fallback: expanded list of popular currencies
        setCurrencies([
          "USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY", "INR", "BRL",
          "MXN", "SGD", "HKD", "KRW", "THB", "NZD", "SEK", "NOK", "DKK", "PLN",
          "CZK", "HUF", "RUB", "TRY", "ZAR", "EGP", "MAD", "TND", "NGN", "GHS",
          "KES", "TZS", "UGX", "ETB", "ILS", "AED", "SAR", "QAR", "KWD", "BHD",
          "PKR", "BDT", "LKR", "NPR", "ARS", "CLP", "COP", "PEN", "UYU", "JMD"
        ]);
      });
  }, []);

  // Fetch chart data
  const fetchChartData = useCallback(async () => {
    try {
      const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      if (!data || !data.rates) {
        throw new Error('Invalid chart data response');
      }
      
      // Create a simple chart with current rate (since this API doesn't have historical data)
      const currentRate = data.rates[toCurrency];
      if (currentRate) {
        const chartArray = [{
          date: new Date().toLocaleDateString(),
          rate: parseFloat(currentRate).toFixed(4),
        }];
        setChartData(chartArray);
      } else {
        setChartData([]);
      }
    } catch (error) {
      setChartData([]);
    }
  }, [fromCurrency, toCurrency]);

  // Fetch multi-currency data
  const fetchMultiCurrencyData = useCallback(async () => {
    try {
      const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      if (!data || !data.rates) {
        throw new Error('Invalid multi-currency response');
      }
      const topCurrencies = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY", "INR", "BRL"];
      const multiData = topCurrencies
        .filter(currency => currency !== fromCurrency)
        .map(currency => ({
          currency,
          rate: data.rates[currency] || 0,
          flag: currencyToCountry[currency] || "XX"
        }))
        .filter(item => item.rate > 0)
        .sort((a, b) => b.rate - a.rate);
      setMultiCurrencyData(multiData);
    } catch (error) {
      setMultiCurrencyData([]);
    }
  }, [fromCurrency, currencyToCountry]);

  // Convert function
  const convert = useCallback(async () => {
    if (!amount || amount <= 0) {
      setResult("Please enter a valid amount.");
      return;
    }
    if (!navigator.onLine) {
      setError("⚠️ You're offline! Please check your internet connection.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
      if (res.ok) {
        const data = await res.json();
        if (!data || !data.rates || !data.rates[toCurrency]) {
          throw new Error('Invalid response from API');
        }
        const rate = data.rates[toCurrency];
        const converted = (amount * rate).toFixed(2);
        if (isNaN(converted) || converted === 'NaN') {
          throw new Error('Invalid conversion result');
        }
        setResult(`${amount} ${fromCurrency} = ${converted} ${toCurrency}`);
        setLastUpdated(new Date().toLocaleTimeString());
        fetchChartData();
        fetchMultiCurrencyData();
      } else {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
    } catch (error) {
      // Fallback to mock data if API fails
      const mockRate = mockRates[fromCurrency]?.[toCurrency];
      if (mockRate) {
        const converted = (amount * mockRate).toFixed(2);
        setResult(`${amount} ${fromCurrency} = ${converted} ${toCurrency}`);
        setLastUpdated(new Date().toLocaleTimeString());
        setError("⚠️ Using realistic sample rates (API unavailable)");
      } else {
        const realisticRates = generateRealisticRates(fromCurrency);
        const generatedRate = realisticRates[toCurrency];
        if (generatedRate) {
          const converted = (amount * generatedRate).toFixed(2);
          setResult(`${amount} ${fromCurrency} = ${converted} ${toCurrency}`);
          setLastUpdated(new Date().toLocaleTimeString());
          setError("⚠️ Using generated realistic rates (API unavailable)");
        } else {
          setError("Unable to convert. Try different currencies or check connection.");
          setResult("");
        }
      }
    } finally {
      setLoading(false);
    }
  }, [amount, fromCurrency, toCurrency, fetchChartData, fetchMultiCurrencyData, mockRates, generateRealisticRates]);

  const swapCurrencies = useCallback(() => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  }, [fromCurrency, toCurrency]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "Enter") {
        convert();
      } else if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        swapCurrencies();
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [convert, swapCurrencies]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Prepare options for react-select
  const currencyOptions = currencies.map((cur) => {
    const flagUrl = currencyToFlag[cur];
    console.log(`Currency: ${cur}, Flag URL: ${flagUrl}`); // Debug log
    return {
      value: cur,
      label: (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {flagUrl ? (
            <img 
              src={flagUrl} 
              alt={`${cur} flag`} 
              style={{ 
                width: "20px", 
                height: "15px", 
                objectFit: "cover",
                borderRadius: "2px"
              }} 
            />
          ) : (
            <span style={{ fontSize: "1.2em" }}>🌍</span>
          )}
          <span>{cur}</span>
        </div>
      ),
    };
  });

  return (
    <div className={`container ${darkMode ? "dark" : ""}`}>
      <div className="header">
        <h2>💱 Advanced Currency Converter</h2>
        <button className="theme-toggle" onClick={toggleDarkMode}>
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>

      {/* Flag test display */}
      <div style={{ 
        background: '#f0f0f0', 
        padding: '10px', 
        margin: '10px 0', 
        borderRadius: '8px',
        fontSize: '1.2em'
      }}>
        <strong>Flag Test:</strong> 
        <img src="https://flagcdn.com/w20/us.png" alt="US" style={{ width: "20px", height: "15px", margin: "0 5px" }} />
        USD 
        <img src="https://flagcdn.com/w20/eu.png" alt="EU" style={{ width: "20px", height: "15px", margin: "0 5px" }} />
        EUR 
        <img src="https://flagcdn.com/w20/gb.png" alt="GB" style={{ width: "20px", height: "15px", margin: "0 5px" }} />
        GBP 
        <img src="https://flagcdn.com/w20/jp.png" alt="JP" style={{ width: "20px", height: "15px", margin: "0 5px" }} />
        JPY 
        <img src="https://flagcdn.com/w20/in.png" alt="IN" style={{ width: "20px", height: "15px", margin: "0 5px" }} />
        INR
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="input-section">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0"
          placeholder="Enter amount"
          className="amount-input"
        />
      </div>

      <div className="selectors">
        <div className="select-group">
          <label>From:</label>
          <Select
            value={currencyOptions.find((opt) => opt.value === fromCurrency)}
            onChange={(opt) => setFromCurrency(opt.value)}
            options={currencyOptions}
            isSearchable
            placeholder="Select currency"
            className="currency-select"
          />
        </div>

        <button className="swap-btn" onClick={swapCurrencies}>
          🔁
        </button>

        <div className="select-group">
          <label>To:</label>
          <Select
            value={currencyOptions.find((opt) => opt.value === toCurrency)}
            onChange={(opt) => setToCurrency(opt.value)}
            options={currencyOptions}
            isSearchable
            placeholder="Select currency"
            className="currency-select"
          />
        </div>
      </div>

      <div className="buttons">
        <button 
          className="convert-btn" 
          onClick={convert}
          disabled={loading}
        >
          {loading ? "⏳ Converting..." : "Convert"}
        </button>
        <button 
          className="multi-btn" 
          onClick={() => setShowMultiTable(!showMultiTable)}
        >
          📊 Multi-Currency
        </button>
      </div>

      {result && (
        <div className="result">
          <div className="result-text">💸 {result}</div>
          {lastUpdated && <div className="time">🕒 Updated: {lastUpdated}</div>}
        </div>
      )}

      {chartData.length > 0 && (
        <div className="chart-section">
          <h4>📈 Current Rate ({fromCurrency} → {toCurrency})</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={['auto', 'auto']} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#007bff"
                strokeWidth={2}
                dot={{ fill: '#007bff', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {showMultiTable && multiCurrencyData.length > 0 && (
        <div className="multi-table">
          <h4>📋 Top 10 Currencies (1 {fromCurrency})</h4>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Flag</th>
                  <th>Currency</th>
                  <th>Rate</th>
                </tr>
              </thead>
              <tbody>
                {multiCurrencyData.slice(0, 10).map((item) => (
                  <tr key={item.currency}>
                    <td>
                      {currencyToFlag[item.currency] ? (
                        <img 
                          src={currencyToFlag[item.currency]} 
                          alt={`${item.currency} flag`} 
                          style={{ 
                            width: "20px", 
                            height: "15px", 
                            objectFit: "cover",
                            borderRadius: "2px"
                          }} 
                        />
                      ) : (
                        <span style={{ fontSize: "1.2em" }}>🌍</span>
                      )}
                    </td>
                    <td>{item.currency}</td>
                    <td>{item.rate.toFixed(4)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="shortcuts">
        <p>⌨️ Shortcuts: Enter = Convert, Ctrl+S = Swap</p>
      </div>
    </div>
  );
}

export default App;