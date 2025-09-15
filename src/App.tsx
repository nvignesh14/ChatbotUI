import { useState } from "react";
import "./App.css"; // We'll use CSS for chat bubbles

function App() {
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first.");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:8000/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    alert(data.message);
  };

  const handleAsk = async () => {
    if (!question.trim()) return;

    // Add user question to chat
    setChatHistory([...chatHistory, { type: "user", text: question }]);

    const res = await fetch("http://localhost:8000/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    const data = await res.json();

    // Format bot message with sources
    let botText = data.answer;
    if (data.sources && data.sources.length > 0) {
      botText += "\n\nSources:\n" + data.sources.map(s => `- ${s.source}: ${s.preview}`).join("\n");
    }

    setChatHistory(prev => [...prev, { type: "bot", text: botText }]);
    setQuestion(""); // Clear input
  };

  return (
    <div className="app-container">
      <h2>📄 Internal Q&A Assistant</h2>

      <div className="upload-section">
        <input type="file" onChange={e => setFile(e.target.files[0])} />
        <button onClick={handleUpload}>Upload Document</button>
      </div>

      <div className="chat-container">
        {chatHistory.map((msg, idx) => (
          <div key={idx} className={`chat-bubble ${msg.type}`}>
            {msg.text.split("\n").map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        ))}
      </div>

      <div className="input-section">
        <textarea
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="Ask a question..."
        />
        <button onClick={handleAsk}>Send</button>
      </div>
    </div>
  );
}

export default App;
