import React, { useEffect, useState } from 'react';
import { Users, Mail, Star, Save, Paperclip, Bold, Italic, List, Link2, Image, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { useParams } from 'react-router';
import Markdown from 'react-markdown'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


interface VolunteerOutreach {
  event_id: string;
  subject: string;
  body: string;
  id: string;
}

const VolunteerOutreachCard = () => {
  const { eventId } = useParams();
  const [outreachData, setOutreachData] = useState<VolunteerOutreach | null>(null);
  const [bodyContent, setBodyContent] = useState('');
  const [subjectContent, setSubjectContent] = useState('');

  useEffect(() => {
    const fetchOutreachData = async () => {
      try {
        const response = await fetch('http://localhost:5001/volunteer_outreach', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ eventId }),
        });
        const data = await response.json();
        if (data && data.length > 0) {
          setOutreachData(data[0]);
          setBodyContent(data[0].body.replace(/\\n/g, '\n'));
          setSubjectContent(data[0].subject.replace(/\\n/g, '\n'));
        }
      } catch (error) {
        console.error('Error fetching volunteer outreach data:', error);
      }
    };
    fetchOutreachData();
  }, []);

  return (
    <AccordionItem value="volunteer" className="border rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 bg-white overflow-hidden z-10">
      <Card className="p-0">
        <AccordionTrigger className="px-6 py-4 hover:no-underline">
          <div className="flex items-center space-x-3">
            <Users className="h-5 w-5 text-green-600" />
            <h2 className="text-xl font-semibold">Volunteer Outreach</h2>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-6 pb-4">
          <div className="space-y-4 pt-2">
            <div className="border rounded-lg p-4 space-y-4">
              {/* Email Header */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="To"
                    className="border-0 border-b focus-visible:ring-0 rounded-none px-1"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Subject"
                    value={subjectContent}
                    onChange={(e) => setSubjectContent(e.target.value)}
                    className="border-0 border-b focus-visible:ring-0 rounded-none px-1"
                  />
                </div>
              </div>

              {/* Toolbar */}
              <div className="flex items-center space-x-2 border-b pb-2">
                <Button variant="ghost" size="sm">
                  <Bold className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Italic className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <List className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Link2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Image className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Paperclip className="h-4 w-4" />
                </Button>
              </div>

              {/* Email Body */}
              <Tabs defaultValue="edit" className="w-full">
                <TabsList className="mb-2">
                  <TabsTrigger value="edit">Edit</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                <TabsContent value="edit">
                  <Textarea
                    className="min-h-[300px] resize-none border-0 focus-visible:ring-0 p-0"
                    value={bodyContent}
                    onChange={(e) => setBodyContent(e.target.value)}
                  />
                </TabsContent>
                <TabsContent value="preview" className="min-h-[300px] prose">
                  <Markdown>{bodyContent}</Markdown>
                </TabsContent>
              </Tabs>

              {/* Email Footer */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center space-x-2">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Send className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>
                  <Button variant="outline">
                    <Save className="h-4 w-4 mr-2" />
                    Save Draft
                  </Button>
                </div>
                <Button variant="ghost" size="sm">
                  <Paperclip className="h-4 w-4 mr-2" />
                  Attach Files
                </Button>
              </div>
            </div>
          </div>
        </AccordionContent>
      </Card>
    </AccordionItem>
  );
};

export default VolunteerOutreachCard;