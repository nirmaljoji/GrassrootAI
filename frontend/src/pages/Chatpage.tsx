import React, { useState, useRef, useEffect } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Chatpage = () => {
  const [messages, setMessages] = useState<Message[]>([{
    content: "Hello! I'm your event planning assistant. Let's work together to plan your event. What would you like to discuss first?",
    sender: 'bot',
    timestamp: new Date()
  }]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [eventDetails, setEventDetails] = useState({
    nameChecked: false,
    locationChecked: false,
    budgetChecked: false,
    peopleChecked: false,
    datesChecked: false
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const botMessage: Message = {
        content: "I understand. Let me help you with that. What is the location of the event?",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleCheck = (field: keyof typeof eventDetails) => {
    setEventDetails(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className="flex flex-row h-screen w-full">
      {/* Left Section (30%) */}
      <div className="w-[30%] bg-black p-6 flex flex-col items-center">
        <Card className="w-[90%] bg-neutral-900 border-neutral-800">
          <CardHeader>
            <h2 className="text-2xl font-semibold text-white text-center">
              Event Planning Checklist
            </h2>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4 bg-black p-3 rounded-lg">
              <Checkbox 
                id="name"
                checked={eventDetails.nameChecked}
                onCheckedChange={() => toggleCheck('nameChecked')}
                className="border-neutral-600"
              />
              <label htmlFor="name" className="text-white font-medium">Name of Event</label>
            </div>

            <div className="flex items-center space-x-4 bg-black p-3 rounded-lg">
              <Checkbox 
                id="location"
                checked={eventDetails.locationChecked}
                onCheckedChange={() => toggleCheck('locationChecked')}
                className="border-neutral-600"
              />
              <label htmlFor="location" className="text-white font-medium">Location of Event</label>
            </div>

            <div className="flex items-center space-x-4 bg-black p-3 rounded-lg">
              <Checkbox 
                id="budget"
                checked={eventDetails.budgetChecked}
                onCheckedChange={() => toggleCheck('budgetChecked')}
                className="border-neutral-600"
              />
              <label htmlFor="budget" className="text-white font-medium">Budget</label>
            </div>

            <div className="flex items-center space-x-4 bg-black p-3 rounded-lg">
              <Checkbox 
                id="people"
                checked={eventDetails.peopleChecked}
                onCheckedChange={() => toggleCheck('peopleChecked')}
                className="border-neutral-600"
              />
              <label htmlFor="people" className="text-white font-medium">Number of People</label>
            </div>

            <div className="flex items-center space-x-4 bg-black p-3 rounded-lg">
              <Checkbox 
                id="dates"
                checked={eventDetails.datesChecked}
                onCheckedChange={() => toggleCheck('datesChecked')}
                className="border-neutral-600"
              />
              <label htmlFor="dates" className="text-white font-medium">Dates of Event</label>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Section (70%) */}
      <div className="w-[70%] bg-white flex flex-col">
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-4 rounded-lg max-w-[80%] ${
                  message.sender === 'user' 
                    ? 'bg-black text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <p>{message.content}</p>
                  <div className={`text-xs mt-1 ${
                    message.sender === 'user' 
                      ? 'text-gray-300' 
                      : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        <div className="border-t p-4 bg-gray-50">
          <div className="flex gap-3 max-w-4xl mx-auto">
            <Input 
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..." 
              className="flex-1"
              disabled={isLoading}
            />
            <Button 
              onClick={handleSendMessage} 
              variant="default"
              className="bg-black hover:bg-neutral-800 text-white"
              disabled={isLoading}
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatpage;