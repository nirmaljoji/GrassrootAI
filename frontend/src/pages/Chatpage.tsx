import React, { useState, useRef, useEffect } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  CalendarDays, 
  MapPin, 
  DollarSign, 
  Users, 
  PartyPopper,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [messages, setMessages] = useState<Message[]>([
    {
      content: "Hello! I'm your event planning assistant. What's the name of your event?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
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

  const progress = (completedFields.size / 5) * 100;

  // Extract event details from user input
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
        // Simple date match
        const dateMatch = message.match(/\d{4}-\d{2}-\d{2}/);
        if (dateMatch) {
          setEventDetails(prev => ({ ...prev, date: dateMatch[0] }));
          setCompletedFields(prev => new Set(prev).add('date'));
          // Possibly move on to a 'complete' or end state here
          return true;
        }
        return false;

      default:
        return false;
    }
  };

  // Provide next prompt based on current field, skipping the repeated event question
  const getNextPrompt = () => {
    switch (currentField) {
      case 'event':
        // We've already asked for the event name in the initial message,
        // so just move on:
        return "Great! Let's move on to location...";
      case 'location':
        return `Where will '${eventDetails.event}' be held?`;
      case 'budget':
        return "What's your budget for this event? (Please include $ symbol)";
      case 'num_of_people':
        return "How many people are you expecting at the event?";
      case 'date':
        return "What's the date for your event? (Format: YYYY-MM-DD)";
      default:
        return "Perfect! I have all the essential details. Would you like to review them?";
    }
  };

  // Send user message and bot response
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // Add user message
    setMessages(prev => [
      ...prev,
      {
        content: inputMessage,
        sender: 'user',
        timestamp: new Date()
      }
    ]);

    // Extract details
    const detailsExtracted = extractEventDetails(inputMessage);

    // Add bot response after a small delay
    setTimeout(() => {
      const nextPrompt = getNextPrompt();
      setMessages(prev => [
        ...prev,
        {
          content: detailsExtracted
            ? nextPrompt
            : "I couldn't understand that. " + nextPrompt,
          sender: 'bot',
          timestamp: new Date()
        }
      ]);
    }, 500);

    setInputMessage('');
  };

  // Utility to format display in the checklist
  const formatValue = (key: keyof EventDetails, value: any): string => {
    if (value === null) return 'Not provided';
    switch (key) {
      case 'budget':
        return `$${value}`;
      case 'num_of_people':
        return `${value} people`;
      default:
        return value.toString();
    }
  };

  // Scroll down as new messages appear
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const isAllCompleted = completedFields.size === 5;

  return (
    <div className="flex flex-row h-screen w-full">
      {/* Left Section (30%) */}
      <div className="w-[30%] bg-gradient-to-b from-black to-neutral-900 p-6 flex items-center justify-center">
        <Card className="w-[90%] max-w-md bg-neutral-900/50 backdrop-blur-sm border-neutral-800/50 shadow-2xl">
          <CardHeader className="space-y-2 py-3">
            <div className="space-y-0.5">
              <h2 className="text-base font-semibold text-white text-center">
                Event Planning Checklist
              </h2>
              <p className="text-[10px] text-neutral-400 text-center font-medium">
                {isAllCompleted ? 'All details collected!' : `${completedFields.size} of 5 details completed`}
              </p>
            </div>
            <Progress value={progress} className="h-0.5 bg-neutral-800" />
          </CardHeader>
          
          <CardContent className="py-2 px-3 space-y-0.5">
            {[
              { key: 'event', icon: PartyPopper, label: 'Event Name' },
              { key: 'location', icon: MapPin, label: 'Location' },
              { key: 'budget', icon: DollarSign, label: 'Budget' },
              { key: 'num_of_people', icon: Users, label: 'Attendees' },
              { key: 'date', icon: CalendarDays, label: 'Date' }
            ].map(({ key, icon: Icon, label }, index) => (
              <div key={key}>
                <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-neutral-800/50 transition-colors">
                  <Checkbox 
                    checked={completedFields.has(key)}
                    className={cn(
                      "h-3.5 w-3.5 border-neutral-600",
                      "data-[state=checked]:border-green-500 data-[state=checked]:bg-green-500",
                      "transition-colors duration-200"
                    )}
                    disabled
                  />
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <Icon className={cn(
                      "h-3.5 w-3.5",
                      completedFields.has(key) ? "text-green-500" : "text-neutral-500"
                    )} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className={cn(
                          "text-xs font-medium",
                          completedFields.has(key) ? "text-white" : "text-neutral-300"
                        )}>
                          {label}
                        </p>
                        {completedFields.has(key) && (
                          <CheckCircle2 className="h-3 w-3 text-green-500" />
                        )}
                      </div>
                      <p className={cn(
                        "text-[10px] truncate",
                        completedFields.has(key) ? "text-green-500" : "text-neutral-500"
                      )}>
                        {formatValue(key as keyof EventDetails, eventDetails[key as keyof EventDetails]) || 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>
                {index < 4 && <Separator className="my-0.5 bg-neutral-800/50" />}
              </div>
            ))}
          </CardContent>

          <CardFooter className="pt-2 pb-3 px-3">
            <Button 
              size="sm"
              className={cn(
                "w-full transition-all duration-200 text-xs font-medium h-8",
                isAllCompleted 
                  ? "bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/20" 
                  : "bg-neutral-800 text-neutral-400 cursor-not-allowed hover:bg-neutral-800"
              )}
              disabled={!isAllCompleted}
            >
              <span className="flex items-center gap-1.5">
                {isAllCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                {isAllCompleted ? 'Generate Event Plan' : 'Complete All Details'}
              </span>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Right Section (70%) */}
      <div className="w-[70%] bg-white flex flex-col">
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`p-4 rounded-lg max-w-[80%] ${
                    message.sender === 'user'
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p>{message.content}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
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