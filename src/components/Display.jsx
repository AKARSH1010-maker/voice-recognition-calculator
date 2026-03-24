function Display({ expression, result, voiceStatus, recognizedText }) {
  return (
    <div className="display-box">
      <div className="small-label">Expression</div>
      <div className="expression-display">{expression || '0'}</div>

      <div className="small-label">Result</div>
      <div className="result-display">{result || '0'}</div>

      <div className="voice-info">
        <p><strong>Status:</strong> {voiceStatus}</p>
        <p><strong>Recognized:</strong> {recognizedText || '---'}</p>
      </div>
    </div>
  )
}

export default Display