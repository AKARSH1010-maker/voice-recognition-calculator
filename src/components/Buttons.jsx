function Buttons({ onButtonClick }) {
  const buttons = [
    'AC', 'DEL', '%', '/',
    '7', '8', '9', '*',
    '4', '5', '6', '-',
    '1', '2', '3', '+',
    '0', '.', '=', '(',
    ')', '√', 'x²', 'sin', 'cos', 'tan'
  ]

  return (
    <div className="buttons-grid">
      {buttons.map((btn) => (
        <button
          key={btn}
          className={`calc-btn ${
            ['AC', 'DEL', '%', '/', '*', '-', '+', '=', '(', ')', '√', 'x²', 'sin', 'cos', 'tan'].includes(btn)
              ? 'operator'
              : ''
          }`}
          onClick={() => onButtonClick(btn)}
        >
          {btn}
        </button>
      ))}
    </div>
  )
}

export default Buttons