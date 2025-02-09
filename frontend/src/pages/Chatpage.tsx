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

interface EventDetails {
  event: string | null;
  location: string | null;
  budget: number | null;
  num_of_people: number | null;
  date: string | null;
}

const Chatpage = () => {
  const [messages, setMessages] = useState<Message[]>([{
    content: "Hello! I'm your event planning assistant. What's the name of your event?",
    sender: 'bot',
    timestamp: new Date()
  }]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [currentField, setCurrentField] = useState<keyof EventDetails>('event');
  const [completedFields, setCompletedFields] = useState<Set<string>>(new Set());
  
  const [eventDetails, setEventDetails] = useState<EventDetails>({
    event: null,
    location: null,
    budget: null,
    num_of_people: null,
    date: null
  });

  const extractEventDetails = (message: string): boolean => {
    switch (currentField) {
      case 'event':
        if (message.trim()) {
          setEventDetails(prev => ({ ...prev, event: message.trim() }));
          setCompletedFields(prev => new Set(prev).add('event'));
          setCurrentField('location');
          return true;
        }
        return false;

      case 'location':
        if (message.trim()) {
          setEventDetails(prev => ({ ...prev, location: message.trim() }));
          setCompletedFields(prev => new Set(prev).add('location'));
          setCurrentField('budget');
          return true;
        }
        return false;
        
      case 'budget':
        if (message.includes('$')) {
          const budget = parseFloat(message.replace(/[^0-9.]/g, ''));
          if (!isNaN(budget)) {
            setEventDetails(prev => ({ ...prev, budget }));
            setCompletedFields(prev => new Set(prev).add('budget'));
            setCurrentField('num_of_people');
            return true;
          }
        }
        return false;
        
      case 'num_of_people':
        const num = parseInt(message.replace(/[^0-9]/g, ''));
        if (!isNaN(num)) {
          setEventDetails(prev => ({ ...prev, num_of_people: num }));
          setCompletedFields(prev => new Set(prev).add('num_of_people'));
          setCurrentField('date');
          return true;
        }
        return false;
        
      case 'date':
        const dateMatch = message.match(/\d{4}-\d{2}-\d{2}/);
        if (dateMatch) {
          setEventDetails(prev => ({ ...prev, date: dateMatch[0] }));
          setCompletedFields(prev => new Set(prev).add('date'));
          setCurrentField('date');
          return true;
        }
        return false;

      default:
        return false;
    }
  };

  const getNextPrompt = () => {
    switch(currentField) {
      case 'event':
        return "What's the name of your event?";
      case 'location':
        return `Great! Where will '${eventDetails.event}' be held?`;
      case 'budget':
        return "What's your budget for this event? (Please include $ symbol)";
      case 'num_of_people':
        return "How many people are you expecting at the event?";
      case 'date':
        return "What's the date for your event? (Format: YYYY-MM-DD)";
    //   case 'complete':
        return "Perfect! I have all the essential details. Would you like to review them?";
      default:
        return "I couldn't understand that. Please try again.";
    }
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // Add user message
    setMessages(prev => [...prev, {
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    }]);

    // Extract details from user message
    const detailsExtracted = extractEventDetails(inputMessage);

    // Add bot response
    setTimeout(() => {
      const nextPrompt = getNextPrompt();
      setMessages(prev => [...prev, {
        content: detailsExtracted ? nextPrompt : "I couldn't understand that. " + nextPrompt,
        sender: 'bot',
        timestamp: new Date()
      }]);
    }, 500);

    setInputMessage('');
  };

  const formatValue = (key: keyof EventDetails, value: any): string => {
    if (value === null) return 'Not provided';
    switch (key) {
      case 'budget': return `$${value}`;
      case 'num_of_people': return `${value} people`;
      case 'date': return value;
      default: return value.toString();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
            {Object.entries(eventDetails).map(([field, value]) => (
              <div key={field} className="flex items-center space-x-4 bg-black p-3 rounded-lg">
                <Checkbox 
                  checked={completedFields.has(field)}
                  className="border-neutral-600"
                  disabled
                />
                <label className="text-white font-medium">
                  {field.replace(/_/g, ' ').charAt(0).toUpperCase() + field.slice(1)}: {formatValue(field as keyof EventDetails, value)}
                </label>
              </div>
            ))}
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
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <div className="border-t p-4 bg-gray-50">
          <div className="flex gap-3 max-w-4xl mx-auto">
            <Input 
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message here..." 
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage}
              className="bg-black hover:bg-neutral-800 text-white"
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