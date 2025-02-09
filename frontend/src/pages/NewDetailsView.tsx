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
import { CalendarDays, Users, Share2, FileText, Building2 } from "lucide-react";

interface NewDetailsViewProps {
  // Add any props if needed
}

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

      {/* Right Content Area - White Background */}
      <div className="w-2/3 bg-white p-8">
        <ScrollArea className="h-full">
          <div className="space-y-6">
            <Accordion type="single" collapsible className="space-y-4">
              {/* Resources Card */}
              <AccordionItem value="resources" className="border rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 bg-white overflow-hidden">
                <Card className="p-0">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <h2 className="text-xl font-semibold">Resources</h2>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <div className="space-y-4 pt-2">
                      {/* Add resource content here */}
                      <p className="text-gray-600">Manage your event resources and assets here.</p>
                    </div>
                  </AccordionContent>
                </Card>
              </AccordionItem>

              {/* Social Media Card */}
              <AccordionItem value="social" className="border rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 bg-white overflow-hidden">
                <Card className="p-0">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex items-center space-x-3">
                      <Share2 className="h-5 w-5 text-purple-600" />
                      <h2 className="text-xl font-semibold">Social Media</h2>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <div className="space-y-4 pt-2">
                      {/* Add social media content here */}
                      <p className="text-gray-600">Manage your social media campaigns and posts.</p>
                    </div>
                  </AccordionContent>
                </Card>
              </AccordionItem>

              {/* Volunteer Outreach Card */}
              <AccordionItem value="volunteer" className="border rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 bg-white overflow-hidden">
                <Card className="p-0">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex items-center space-x-3">
                      <Users className="h-5 w-5 text-green-600" />
                      <h2 className="text-xl font-semibold">Volunteer Outreach</h2>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <div className="space-y-4 pt-2">
                      {/* Add volunteer content here */}
                      <p className="text-gray-600">Coordinate and manage volunteer activities.</p>
                    </div>
                  </AccordionContent>
                </Card>
              </AccordionItem>

              {/* Schedule Card */}
              <AccordionItem value="schedule" className="border rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 bg-white overflow-hidden">
                <Card className="p-0">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex items-center space-x-3">
                      <CalendarDays className="h-5 w-5 text-red-600" />
                      <h2 className="text-xl font-semibold">Schedule</h2>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <div className="space-y-4 pt-2">
                      {/* Add schedule content here */}
                      <p className="text-gray-600">View and manage event timeline and schedules.</p>
                    </div>
                  </AccordionContent>
                </Card>
              </AccordionItem>

              {/* Permit Card */}
              <AccordionItem value="permit" className="border rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 bg-white overflow-hidden">
                <Card className="p-0">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex items-center space-x-3">
                      <Building2 className="h-5 w-5 text-amber-600" />
                      <h2 className="text-xl font-semibold">Permit</h2>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <div className="space-y-4 pt-2">
                      {/* Add permit content here */}
                      <p className="text-gray-600">Manage event permits and legal documentation.</p>
                    </div>
                  </AccordionContent>
                </Card>
              </AccordionItem>
            </Accordion>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default NewDetailsView;
