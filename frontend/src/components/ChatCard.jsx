function ChatCard({
  question,
  setQuestion,
  askQuestion,
  summarize,
}) {
  return (
    <div className="card">
      <h2>💬 Ask Questions</h2>

      <input
        type="text"
        placeholder="Ask anything about the uploaded PDF..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <div className="section-buttons">
        <button onClick={askQuestion}>
          Ask
        </button>

        <button onClick={summarize}>
          Summarize
        </button>
      </div>
    </div>
  );
}

export default ChatCard;