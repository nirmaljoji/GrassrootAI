import React from "react";
import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import "./App.css";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

// Retaining About inline or move to its page as needed
const About = () => {
  return (
    <div>
      <h1>About</h1>
    </div>
  );
};

export default App;