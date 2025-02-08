import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import { useState, useEffect } from "react";
import "./App.css";
import { fetchMessage } from "./lib/api";

const App = () => {
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchMessage()
      .then((data) => setMessage(data.message))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-4">Message from Backend</h1>
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <p className="text-lg">{message || "Loading..."}</p>
        )}
      </div>
    </div>
  );
};


const About = () => {
  return (
    <div>
      <h1>About</h1>
    </div>
  );
};

export default App;