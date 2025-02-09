import React from 'react';
import { Building2, FileText, CalendarDays } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

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

const PermitCard = () => {
  return (
    <AccordionItem value="permit" className="border rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 bg-white overflow-hidden z-10">
      <Card className="p-0">
        <AccordionTrigger className="px-6 py-4 hover:no-underline">
          <div className="flex items-center space-x-3">
            <Building2 className="h-5 w-5 text-amber-600" />
            <h2 className="text-xl font-semibold">Permit</h2>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-6 pb-4">
          <div className="space-y-4 pt-2">
            <p className="text-gray-600 mb-4">Track and manage required permits and legal documentation for your event.</p>
            
            <div className="grid gap-4">
              {permitData.map((permit) => (
                <div 
                  key={permit.id} 
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <h3 className="font-semibold text-gray-900">{permit.name}</h3>
                      </div>
                      <p className="text-sm text-gray-600 ml-7">{permit.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        permit.status === 'Approved' ? 'bg-green-100 text-green-800' :
                        permit.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {permit.status}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 ml-7 flex items-center text-sm text-gray-500">
                    <CalendarDays className="h-4 w-4 mr-1" />
                    <span>Expires: {permit.expiryDate}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-4">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <FileText className="h-4 w-4 mr-2" />
                Submit New Permit
              </Button>
            </div>
          </div>
        </AccordionContent>
      </Card>
    </AccordionItem>
  );
};

export default PermitCard; 