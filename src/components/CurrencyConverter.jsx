import { useEffect, useState } from 'react'
import { currencyRates as fallbackRates } from '../utils/currencyRates'

function CurrencyConverter() {
  const [amount, setAmount] = useState('1')
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('INR')
  const [result, setResult] = useState('')
  const [history, setHistory] = useState([])
  const [rates, setRates] = useState(fallbackRates)
  const [loadingRates, setLoadingRates] = useState(true)
  const [ratesError, setRatesError] = useState('')
  const [lastUpdated, setLastUpdated] = useState('')

  const currencies = Object.keys(rates)

  useEffect(() => {
    const savedHistory = localStorage.getItem('currency-history')
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('currency-history', JSON.stringify(history))
  }, [history])

  useEffect(() => {
    const fetchRates = async () => {
      try {
        setLoadingRates(true)
        setRatesError('')

        const response = await fetch('https://open.er-api.com/v6/latest/USD')
        const data = await response.json()

        if (!response.ok || data.result !== 'success' || !data.rates) {
          throw new Error('Failed to fetch live rates')
        }

        setRates(data.rates)
        setLastUpdated(data.time_last_update_utc || 'Latest rates loaded')
      } catch (error) {
        setRates(fallbackRates)
        setRatesError('Live rates unavailable. Using saved fallback rates.')
      } finally {
        setLoadingRates(false)
      }
    }

    fetchRates()
  }, [])

  const handleConvert = () => {
    const numericAmount = Number(amount)

    if (!amount || Number.isNaN(numericAmount) || numericAmount <= 0) {
      setResult('Invalid amount')
      return
    }

    if (!rates[fromCurrency] || !rates[toCurrency]) {
      setResult('Currency rate unavailable')
      return
    }

    const amountInUSD = numericAmount / rates[fromCurrency]
    const converted = amountInUSD * rates[toCurrency]
    const finalResult = converted.toFixed(2)

    setResult(`${numericAmount} ${fromCurrency} = ${finalResult} ${toCurrency}`)

    setHistory((prev) => [
      {
        text: `${numericAmount} ${fromCurrency} = ${finalResult} ${toCurrency}`,
        time: new Date().toLocaleString(),
      },
      ...prev,
    ])
  }

  const handleSwap = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem('currency-history')
  }

  return (
    <div className="converter-panel">
      <h2>Currency Converter</h2>

      <div className="converter-box">
        <div className="rates-status">
          {loadingRates ? (
            <p>Loading latest exchange rates...</p>
          ) : ratesError ? (
            <p>{ratesError}</p>
          ) : (
            <p>Live rates loaded successfully.</p>
          )}

          {lastUpdated && <p><strong>Last Updated:</strong> {lastUpdated}</p>}

          <p className="rate-note">
            Exchange data source: ExchangeRate-API
          </p>
        </div>

        <label>Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="converter-input"
        />

        <label>From</label>
        <select
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
          className="converter-select"
        >
          {currencies.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>

        <label>To</label>
        <select
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
          className="converter-select"
        >
          {currencies.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>

        <div className="converter-actions">
          <button className="voice-btn" onClick={handleConvert}>
            Convert
          </button>

          <button className="swap-btn" onClick={handleSwap}>
            Swap
          </button>
        </div>

        <div className="converter-result">
          <strong>Result:</strong> {result || 'No conversion yet'}
        </div>
      </div>

      <div className="history-panel converter-history">
        <div className="history-header">
          <h2>Conversion History</h2>
          <button className="clear-history-btn" onClick={clearHistory}>
            Clear
          </button>
        </div>

        {history.length === 0 ? (
          <p className="empty-history">No conversions yet.</p>
        ) : (
          <div className="history-list">
            {history.map((item, index) => (
              <div key={index} className="history-item">
                <div className="history-expression">{item.text}</div>
                <div className="history-time">{item.time}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CurrencyConverter