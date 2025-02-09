import React from 'react';
import { FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

// Move the resources data here
const resourcesData = [
  { id: 1, name: "Projector", completed: false },
  { id: 2, name: "Microphone System", completed: true },
  { id: 3, name: "Chairs (200)", completed: false },
  { id: 4, name: "Registration Desk", completed: true },
  { id: 5, name: "Banners", completed: false },
];

const ResourcesCard = () => {
  return (
    <AccordionItem value="resources" className="border rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 bg-white overflow-hidden z-10">
      <Card className="p-0">
        <AccordionTrigger className="px-6 py-4 hover:no-underline">
          <div className="flex items-center space-x-3">
            <FileText className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold">Resources</h2>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-6 pb-4">
          <div className="space-y-4 pt-2">
            <p className="text-gray-600">Manage your event resources and assets here.</p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">No.</TableHead>
                  <TableHead>Resource Name</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resourcesData.map((resource) => (
                  <TableRow key={resource.id}>
                    <TableCell>{resource.id}</TableCell>
                    <TableCell>{resource.name}</TableCell>
                    <TableCell>
                      <Checkbox 
                        checked={resource.completed}
                        onCheckedChange={() => {}}
                        className="ml-2"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </AccordionContent>
      </Card>
    </AccordionItem>
  );
};

export default ResourcesCard; 