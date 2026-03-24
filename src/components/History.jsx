function History({ history, clearHistory }) {
  return (
    <div className="history-panel">
      <div className="history-header">
        <h2>History</h2>
        <button className="clear-history-btn" onClick={clearHistory}>
          Clear
        </button>
      </div>

      {history.length === 0 ? (
        <p className="empty-history">No calculations yet.</p>
      ) : (
        <div className="history-list">
          {history.map((item, index) => (
            <div key={index} className="history-item">
              <div className="history-expression">
                {item.expression} = {item.result}
              </div>
              <div className="history-time">{item.time}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default History