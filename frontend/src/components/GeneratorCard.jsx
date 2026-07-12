function GeneratorCard({
  topic,
  setTopic,
  generateContent,
  getStats,
}) {
  return (
    <div className="card">
      <h2>✨ AI Content Generator</h2>

      <input
        type="text"
        placeholder="Enter a topic..."
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />

      <div className="section-buttons">
        <button onClick={() => generateContent("ideas")}>
          Ideas
        </button>

        <button onClick={() => generateContent("linkedin")}>
          LinkedIn
        </button>

        <button onClick={() => generateContent("blog")}>
          Blog
        </button>

        <button onClick={() => generateContent("youtube")}>
          YouTube
        </button>

        <button onClick={() => generateContent("hashtags")}>
          Hashtags
        </button>

        <button onClick={getStats}>
          Stats
        </button>
      </div>
    </div>
  );
}

export default GeneratorCard;