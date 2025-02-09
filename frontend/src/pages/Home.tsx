import React from 'react';
import { FC } from 'react';
import { Link } from "react-router-dom";

const Home = () => {
  const suggestions = [
    "Blood Donation Drive",
    "River Cleanup",
    "Vaccination Clinic",
    "Food Distribution",
  ];

  const handleBoxClick = () => {
    console.log("Navigating to another page...");
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome Home</h1>
      <Link 
        to="/chat" 
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Go to Chat
      </Link>
    </div>
  );
};

export default Home;