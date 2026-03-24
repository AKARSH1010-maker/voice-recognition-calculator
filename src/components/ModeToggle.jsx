function ModeToggle({ mode, setMode }) {
  return (
    <div className="mode-toggle">
      <button
        className={mode === 'calculator' ? 'mode-btn active' : 'mode-btn'}
        onClick={() => setMode('calculator')}
      >
        Calculator
      </button>

      <button
        className={mode === 'converter' ? 'mode-btn active' : 'mode-btn'}
        onClick={() => setMode('converter')}
      >
        Currency Converter
      </button>
    </div>
  )
}

export default ModeToggle