import { useState } from "react";
import ReactMarkdown from "react-markdown";

function OutputCard({ output, loading }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(output);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="card">

      <div className="output-header">

        <h2>🤖 AI Response</h2>

        <button
          className="copy-btn"
          onClick={copyToClipboard}
        >
          {copied ? "✅ Copied!" : "📋 Copy"}
        </button>

      </div>

      <div className="output">

        {loading ? (
          <div className="loading-container">
            <div className="loader"></div>
            <p>Generating response...</p>
          </div>
        ) : (
          <ReactMarkdown>
            {output || "Your AI response will appear here..."}
          </ReactMarkdown>
        )}

      </div>

    </div>
  );
}

export default OutputCard;