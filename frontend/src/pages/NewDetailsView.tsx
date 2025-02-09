import React from 'react';
import { useParams } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CalendarDays, Users, Share2, FileText, Building2, ArrowDown, Facebook, Instagram, Twitter, Linkedin, Send, Mail, Star, Save, Paperclip, Bold, Italic, List, Link2, Image, Wallet, DollarSign } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import ResourcesCard from '@/components/details-cards/ResourcesCard';
import SocialMediaCard from '@/components/details-cards/SocialMediaCard';
import VolunteerOutreachCard from '@/components/details-cards/VolunteerOutreachCard';
import BudgetCard from '@/components/details-cards/BudgetCard';
import PermitCard from '@/components/details-cards/PermitCard';

interface NewDetailsViewProps {
  // Add any props if needed
}

// Add this dummy data near the top of the component
const resourcesData = [
  { id: 1, name: "Projector", completed: false },
  { id: 2, name: "Microphone System", completed: true },
  { id: 3, name: "Chairs (200)", completed: false },
  { id: 4, name: "Registration Desk", completed: true },
  { id: 5, name: "Banners", completed: false },
];

// Add this dummy data
const socialMediaData = {
  facebook: {
    groups: [
      "Tech Enthusiasts Singapore",
      "Digital Events SG",
      "Singapore Tech Community",
      "IT Professionals Network",
      "Tech Conference Group"
    ]
  },
  instagram: {
    sampleMessage: "Join us for the biggest tech conference of 2024! 🚀 #TechConf2024 #Innovation"
  },
  twitter: {
    tweet: "Excited to announce our keynote speakers for #TechConf2024! Stay tuned for more updates. 🎯"
  },
  linkedin: {
    message: "We're bringing together industry leaders and innovators for an unprecedented tech conference experience."
  }
};

// Add this dummy data near the top where other dummy data is defined
const volunteerEmailTemplate = {
  subject: "Join Us as a Volunteer for Tech Conference 2024",
  body: `Dear Tech Enthusiast,

We're excited to invite you to be part of our upcoming Tech Conference 2024 as a volunteer! This is a fantastic opportunity to network with industry leaders and gain hands-on event management experience.

Event Details:
- Date: March 15-16, 2024
- Venue: Singapore Convention Center
- Roles: Registration, Session Management, Technical Support

Benefits:
• Free access to conference sessions
• Exclusive volunteer t-shirt
• Certificate of participation
• Networking opportunities

If you're interested, please reply with your:
1. Full Name
2. Contact Number
3. Preferred Role
4. Previous volunteer experience (if any)

Best regards,
Tech Conference 2024 Team`
};

// Add this budget data near other dummy data
const budgetData = [
  { name: 'Venue Rental', value: 15000, color: '#0088FE' },
  { name: 'Catering', value: 8000, color: '#00C49F' },
  { name: 'Marketing', value: 5000, color: '#FFBB28' },
  { name: 'Equipment', value: 4000, color: '#FF8042' },
  { name: 'Staff', value: 3000, color: '#8884d8' },
  { name: 'Miscellaneous', value: 2000, color: '#82ca9d' },
];

// Add this dummy data near the top where other dummy data is defined
const permitData = [
  {
    id: 1,
    name: "Public Assembly Permit",
    description: "Authorization for hosting large-scale public gatherings of more than 200 people",
    status: "Approved",
    expiryDate: "2024-03-14"
  },
  {
    id: 2,
    name: "Fire Safety Certificate",
    description: "Compliance certification for venue fire safety regulations and emergency protocols",
    status: "Pending",
    expiryDate: "2024-03-10"
  },
  {
    id: 3,
    name: "Food Handling License",
    description: "Permission for serving food and beverages during the event",
    status: "Under Review",
    expiryDate: "2024-03-12"
  },
  {
    id: 4,
    name: "Sound & Entertainment License",
    description: "Authorization for audio systems and entertainment activities",
    status: "Approved",
    expiryDate: "2024-03-15"
  }
];

const NewDetailsView: React.FC<NewDetailsViewProps> = () => {
  const { id } = useParams();
  const eventName = "Tech Conference 2024"; // Replace with actual event name from your data

  return (
    <div className="flex h-screen w-full">
      {/* Left Panel - Black Background */}
      <div className="w-1/3 bg-black text-white p-8">
        <div className="h-full flex flex-col">
          <h1 className="text-3xl font-bold tracking-tight mb-4">
            {eventName}
          </h1>
          <Separator className="bg-gray-700 my-4" />
          <ScrollArea className="flex-grow">
            {/* Add additional left panel content here */}
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-gray-200">Event Details</h2>
                <p className="text-gray-400">ID: {id}</p>
              </div>
              
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-gray-200">Quick Actions</h2>
                {/* Add quick action buttons here */}
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Right Content Area */}
      <div className="w-2/3 bg-white p-8">
        <ScrollArea className="h-full">
          <div className="max-w-3xl mx-auto relative min-h-[calc(100vh-4rem)] flex items-center">
            {/* Vertical line connecting the cards */}
            <div className="absolute left-1/2 top-[10%] bottom-[10%] w-0.5 bg-gray-200 -translate-x-1/2" />

            <Accordion 
              type="single" 
              collapsible 
              className="w-full space-y-16 my-12"
            >
              {/* Resources Card */}
              <div className="relative">
                <ResourcesCard />
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 z-20">
                  <div className="bg-white rounded-full p-1">
                    <ArrowDown className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Social Media Card */}
              <div className="relative">
                <SocialMediaCard />
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 z-20">
                  <div className="bg-white rounded-full p-1">
                    <ArrowDown className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Volunteer Outreach Card */}
              <div className="relative">
                <VolunteerOutreachCard />
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 z-20">
                  <div className="bg-white rounded-full p-1">
                    <ArrowDown className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Budget Card */}
              <div className="relative">
                <BudgetCard />
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 z-20">
                  <div className="bg-white rounded-full p-1">
                    <ArrowDown className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Permit Card */}
              <div className="relative">
                <PermitCard />
              </div>
            </Accordion>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default NewDetailsView;
