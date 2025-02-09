import React, { useState } from 'react';

const Chatpage = () => {
  const [eventDetails, setEventDetails] = useState({
    nameChecked: false,
    locationChecked: false,
    budgetChecked: false,
    peopleChecked: false,
    datesChecked: false
  });

  const toggleCheck = (field: keyof typeof eventDetails) => {
    setEventDetails(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className="flex flex-row h-screen w-full">
      {/* Left Section (30%) */}
      <div className="w-[30%] bg-gray-800 p-6">
        <h2 className="text-white text-xl font-bold mb-6">Event Planning Checklist</h2>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={eventDetails.nameChecked}
              onChange={() => toggleCheck('nameChecked')}
              className="h-4 w-4 mr-3"
            />
            <span className="text-white">Name of Event</span>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={eventDetails.locationChecked}
              onChange={() => toggleCheck('locationChecked')}
              className="h-4 w-4 mr-3"
            />
            <span className="text-white">Location of Event</span>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={eventDetails.budgetChecked}
              onChange={() => toggleCheck('budgetChecked')}
              className="h-4 w-4 mr-3"
            />
            <span className="text-white">Budget</span>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={eventDetails.peopleChecked}
              onChange={() => toggleCheck('peopleChecked')}
              className="h-4 w-4 mr-3"
            />
            <span className="text-white">Number of People</span>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={eventDetails.datesChecked}
              onChange={() => toggleCheck('datesChecked')}
              className="h-4 w-4 mr-3"
            />
            <span className="text-white">Dates of Event</span>
          </div>
        </div>
      </div>

      {/* Right Section (70%) */}
      <div className="w-[70%] bg-white flex flex-col">
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Messages container */}
          <div className="mb-4">
            <div className="bg-blue-100 p-3 rounded-lg inline-block max-w-[80%]">
              Hello! I'm your event planning assistant. How can I help you today?
            </div>
          </div>
        </div>
        
        {/* Chat input area */}
        <div className="border-t p-4">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Type your message here..."
              className="flex-1 p-3 border rounded-lg"
            />
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatpage;