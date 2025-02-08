import { useState, useEffect } from "react";
import "./App.css";
import { fetchMessage } from "./lib/api";

function App() {
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchMessage()
      .then((data) => setMessage(data.message))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Message from Backend</h1>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <p className="text-lg">{message || "Loading..."}</p>
      )}
    </div>
  );
}

export default App;
