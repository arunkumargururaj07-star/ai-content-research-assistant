function Sidebar() {
  return (
    <div className="sidebar">
      <h2>AI Studio</h2>

      <div className="sidebar-item active">
        📄 Document
      </div>

      <div className="sidebar-item">
        💬 Chat
      </div>

      <div className="sidebar-item">
        ✨ Generator
      </div>

      <div className="sidebar-item">
        📊 Analytics
      </div>

      <div className="sidebar-footer">
        React + FastAPI + Ollama
      </div>
    </div>
  );
}

export default Sidebar;