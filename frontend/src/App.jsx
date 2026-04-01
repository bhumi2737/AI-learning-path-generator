import { useState } from "react";

function App() {
  const [goal, setGoal] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const generatePath = async () => {
    if (!goal) return;

    setLoading(true);
    setResult("");

    try {
      const res = await fetch("http://localhost:5000/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ goal }),
      });

      const data = await res.json();
      setResult(data.result);
    } catch (error) {
      setResult("❌ Error connecting to server");
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#0f172a",
        color: "white",
      }}
    >
      <div
        style={{
          background: "#1e293b",
          padding: "30px",
          borderRadius: "12px",
          width: "400px",
          textAlign: "center",
        }}
      >
        <h1>🚀 AI Learning Path</h1>

        <input
          type="text"
          placeholder="Enter your goal..."
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          style={{
            padding: "10px",
            width: "100%",
            marginTop: "15px",
            borderRadius: "6px",
            border: "none",
            outline: "none",
          }}
        />

        <button
          onClick={generatePath}
          style={{
            marginTop: "15px",
            padding: "10px",
            width: "100%",
            background: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          {loading ? "Generating..." : "Generate"}
        </button>

        <pre
          style={{
            marginTop: "20px",
            textAlign: "left",
            whiteSpace: "pre-wrap",
            background: "#0f172a",
            padding: "10px",
            borderRadius: "6px",
          }}
        >
          {result}
        </pre>
      </div>
    </div>
  );
}

export default App;