function toRadians(degrees) {
  return degrees * (Math.PI / 180)
}

export function evaluateExpression(expression) {
  try {
    if (!expression || typeof expression !== 'string') return 'Error'

    let exp = expression.replace(/\s+/g, '')

    // square root: √9 or √(81)
    exp = exp.replace(/√\(([^()]+)\)/g, (_, value) => {
      const num = Number(evaluateExpression(value))
      if (Number.isNaN(num) || num < 0) return 'Error'
      return Math.sqrt(num)
    })

    exp = exp.replace(/√(\d+(\.\d+)?)/g, (_, value) => {
      const num = Number(value)
      if (Number.isNaN(num) || num < 0) return 'Error'
      return Math.sqrt(num)
    })

    // square: 5²
    exp = exp.replace(/(\d+(\.\d+)?)²/g, (_, value) => {
      const num = Number(value)
      return Math.pow(num, 2)
    })

    // sin(x)
    exp = exp.replace(/sin\(([^()]+)\)/g, (_, value) => {
      const num = Number(evaluateExpression(value))
      if (Number.isNaN(num)) return 'Error'
      return Math.sin(toRadians(num))
    })

    // cos(x)
    exp = exp.replace(/cos\(([^()]+)\)/g, (_, value) => {
      const num = Number(evaluateExpression(value))
      if (Number.isNaN(num)) return 'Error'
      return Math.cos(toRadians(num))
    })

    // tan(x)
    exp = exp.replace(/tan\(([^()]+)\)/g, (_, value) => {
      const num = Number(evaluateExpression(value))
      if (Number.isNaN(num)) return 'Error'

      const cosine = Math.cos(toRadians(num))
      if (Math.abs(cosine) < 1e-10) return 'Error'

      return Math.tan(toRadians(num))
    })

    if (exp.includes('Error')) return 'Error'

    const sanitized = exp.replace(/[^0-9+\-*/%.()]/g, '')
    if (!sanitized.trim()) return 'Error'

    const result = Function(`"use strict"; return (${sanitized})`)()

    if (result === undefined || Number.isNaN(result) || !Number.isFinite(result)) {
      return 'Error'
    }

    return Number(result.toFixed(6))
  } catch {
    return 'Error'
  }
}