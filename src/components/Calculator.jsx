import { useEffect, useState } from 'react'
import Display from './Display'
import Buttons from './Buttons'
import History from './History'
import VoiceButton from './VoiceButton'
import { evaluateExpression } from '../utils/evaluateExpression'
import { parseVoiceInput } from '../utils/voiceParser'

function Calculator() {
  const [expression, setExpression] = useState('')
  const [result, setResult] = useState('')
  const [history, setHistory] = useState([])
  const [voiceStatus, setVoiceStatus] = useState('Tap mic and speak')
  const [recognizedText, setRecognizedText] = useState('')
  const [language, setLanguage] = useState('en-IN')

  useEffect(() => {
    const savedHistory = localStorage.getItem('calc-history')
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('calc-history', JSON.stringify(history))
  }, [history])

  const appendValue = (value) => {
    setExpression((prev) => prev + value)
  }

  const clearAll = () => {
    setExpression('')
    setResult('')
    setRecognizedText('')
    setVoiceStatus('Tap mic and speak')
  }

  const deleteLast = () => {
    setExpression((prev) => prev.slice(0, -1))
  }

  const handleCalculate = () => {
    if (!expression.trim()) return

    const calcResult = evaluateExpression(expression)

    if (calcResult === 'Error') {
      setResult('Error')
      return
    }

    setResult(String(calcResult))
    setHistory((prev) => [
      {
        expression,
        result: String(calcResult),
        time: new Date().toLocaleString(),
      },
      ...prev,
    ])
  }

  const handleButtonClick = (value) => {
    if (value === 'AC') {
      clearAll()
    } else if (value === 'DEL') {
      deleteLast()
    } else if (value === '=') {
      handleCalculate()
    } else if (value === 'sin' || value === 'cos' || value === 'tan') {
      appendValue(`${value}(`)
    } else if (value === '√') {
      appendValue('√')
    } else if (value === 'x²') {
      appendValue('²')
    } else {
      appendValue(value)
    }
  }

  const handleVoiceResult = (spokenText) => {
    setRecognizedText(spokenText)

    const parsedExpression = parseVoiceInput(spokenText)

    if (!parsedExpression) {
      setVoiceStatus('Could not understand calculation')
      return
    }

    setExpression(parsedExpression)

    const calcResult = evaluateExpression(parsedExpression)
    if (calcResult === 'Error') {
      setResult('Error')
      setVoiceStatus('Invalid expression from voice')
      return
    }

    setResult(String(calcResult))
    setHistory((prev) => [
      {
        expression: parsedExpression,
        result: String(calcResult),
        time: new Date().toLocaleString(),
      },
      ...prev,
    ])

    setVoiceStatus('Voice calculation successful')
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem('calc-history')
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key

      if ('0123456789+-*/.%()'.includes(key)) {
        setExpression((prev) => prev + key)
      } else if (key === 'Enter') {
        event.preventDefault()
        handleCalculate()
      } else if (key === 'Backspace') {
        setExpression((prev) => prev.slice(0, -1))
      } else if (key === 'Escape') {
        clearAll()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  })

  return (
    <div>
      <div className="language-box calculator-language-box">
        <label htmlFor="language">Language:</label>
        <select
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="en-IN">English</option>
          <option value="hi-IN">Hindi</option>
        </select>
      </div>

      <div className="main-grid">
        <div className="calculator-panel">
          <Display
            expression={expression}
            result={result}
            voiceStatus={voiceStatus}
            recognizedText={recognizedText}
          />

          <VoiceButton
            language={language}
            onVoiceResult={handleVoiceResult}
            setVoiceStatus={setVoiceStatus}
          />

          <Buttons onButtonClick={handleButtonClick} />
        </div>

        <History history={history} clearHistory={clearHistory} />
      </div>
    </div>
  )
}

export default Calculator