import { useState } from "react";
import "./App.css";

import UploadCard from "./components/UploadCard";
import ChatCard from "./components/ChatCard";
import GeneratorCard from "./components/GeneratorCard";
import OutputCard from "./components/OutputCard";

 import Sidebar from "./components/Sidebar";

import {
  uploadPDF as uploadPDFAPI,
  askQuestion as askQuestionAPI,
  summarize as summarizeAPI,
  generateIdeas,
  generateLinkedIn,
  generateBlog,
  generateYoutube,
  generateHashtags,
  getStats as getStatsAPI,
} from "./services/api";

function App() {
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [topic, setTopic] = useState("");
  const [output, setOutput] = useState(
    "Welcome to AI Content Research Assistant 🚀"
  );
  const[loading,setLoading]=useState(false)

  const uploadPDF = async () => {
  if (!file) {
    alert("Please select a PDF first.");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    setLoading(true);

    const res = await uploadPDFAPI(formData);

    setOutput(JSON.stringify(res.data, null, 2));
  } catch (err) {
    setOutput(err.message);
  } finally {
    setLoading(false);
  }
};

 const askQuestion = async () => {
  if (!question) {
    alert("Please enter a question.");
    return;
  }

  try {
    setLoading(true);

    const res = await askQuestionAPI(question);

    setOutput(res.data.answer);
  } catch (err) {
    setOutput(err.message);
  } finally {
    setLoading(false);
  }
};

  const summarize = async () => {
  try {
    setLoading(true);

    const res = await summarizeAPI();

    setOutput(res.data.summary);
  } catch (err) {
    setOutput(err.message);
  } finally {
    setLoading(false);
  }
};

  const generateContent = async (type) => {
  if (!topic) {
    alert("Please enter a topic.");
    return;
  }

  try {
    setLoading(true);

    let res;

    switch (type) {
      case "ideas":
        res = await generateIdeas(topic);
        break;

      case "linkedin":
        res = await generateLinkedIn(topic);
        break;

      case "blog":
        res = await generateBlog(topic);
        break;

      case "youtube":
        res = await generateYoutube(topic);
        break;

      case "hashtags":
        res = await generateHashtags(topic);
        break;

      default:
        return;
    }

    const key = Object.keys(res.data)[0];
    setOutput(res.data[key]);

  } catch (err) {
    setOutput(err.message);
  } finally {
    setLoading(false);
  }
};

  const getStats = async () => {
  try {
    setLoading(true);

    const res = await getStatsAPI();

    setOutput(JSON.stringify(res.data, null, 2));
  } catch (err) {
    setOutput(err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="container">

    <div className="hero">

  <span className="hero-badge">
    AI Powered • React • FastAPI • Ollama
  </span>

  <h1 className="title">
    AI Content Research Assistant
  </h1>

  <p className="subtitle">
    Upload documents, ask intelligent questions, summarize content, and generate AI-powered marketing content from one workspace.
  </p>

</div>

      <div className="app-layout">

  <Sidebar />

    <div className="main-layout">

      <div className="left-panel">

        <UploadCard
          file={file}
          setFile={setFile}
          uploadPDF={uploadPDF}
        />

        <ChatCard
          question={question}
          setQuestion={setQuestion}
          askQuestion={askQuestion}
          summarize={summarize}
        />

      </div>

      <div className="right-panel">

        <GeneratorCard
          topic={topic}
          setTopic={setTopic}
          generateContent={generateContent}
          getStats={getStats}
        />

        <OutputCard
            output={output}
        loading={loading}
        />

      </div>

    </div>

    <div className="footer">
      Built with ❤️ using React + FastAPI + Ollama
    </div>
        </div>

  </div>
);
}

export default App;