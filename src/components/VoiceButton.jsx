function VoiceButton({ language, onVoiceResult, setVoiceStatus }) {
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      setVoiceStatus('Speech recognition not supported in this browser')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = language
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => {
      setVoiceStatus('Listening...')
    }

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setVoiceStatus('Processing voice input...')
      onVoiceResult(transcript)
    }

    recognition.onerror = () => {
      setVoiceStatus('Voice recognition error')
    }

    recognition.onend = () => {
      setVoiceStatus((prev) =>
        prev === 'Listening...' ? 'Listening stopped' : prev
      )
    }

    recognition.start()
  }

  return (
    <button className="voice-btn" onClick={startListening}>
      🎤 Start Voice Input
    </button>
  )
}

export default VoiceButton