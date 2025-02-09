import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import TodoList from "../components/TodoList";
import Permits from "@/components/Permits";
import SocialMedia from "@/components/SocialMedia";
import Outreach from "@/components/Outreach";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

const permits = [
  { id: 1, text: "Permit 1", completed: false },
  { id: 2, text: "Permit 2", completed: false },
];

interface OutreachTemplate {
  event_id: string;
  subject: string;
  body: string | null;
  id: string;
}

const ITEMS_PER_PAGE = 5;

const DetailsView: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [outreachTemplates, setOutreachTemplates] = useState<OutreachTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    resources: true,
    permits: true,
    socialMedia: true,
  });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchOutreachTemplates = async () => {
      try {
        const response = await fetch('http://localhost:5001/volunteer_outreach', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ eventId }),
        });
        const data = await response.json();
        setOutreachTemplates(data);
      } catch (error) {
        console.error('Error fetching outreach templates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOutreachTemplates();
  }, [eventId]);

  const handleOutreachComplete = (templateId: string) => {
    setOutreachTemplates(templates => 
      templates.filter(template => template.id !== templateId)
    );
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const totalPages = Math.ceil(outreachTemplates.length / ITEMS_PER_PAGE);
  const paginatedOutreachTemplates = outreachTemplates.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="flex gap-4 p-6 h-screen bg-black">
      {/* Left column - fixed width */}
      <div className="w-[300px] flex-shrink-0">
        <Card className="h-full bg-white">
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit...
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Right column - fills remaining space */}
      <div className="flex-1 flex flex-col gap-4 overflow-y-auto min-h-0">
        {/* Resources Section */}
        <div className="bg-white rounded-lg border shadow-sm">
          <div 
            className="flex flex-row items-center justify-between p-6 cursor-pointer hover:bg-gray-50 rounded-t-lg transition-colors"
            onClick={() => toggleSection('resources')}
          >
            <h3 className="text-xl font-bold">Resources</h3>
            <Button variant="ghost" size="sm" className="hover:bg-transparent">
              {expandedSections.resources ? (
                <ChevronUp className="h-4 w-4 transition-transform duration-200" />
              ) : (
                <ChevronDown className="h-4 w-4 transition-transform duration-200" />
              )}
            </Button>
          </div>
          <div
            className={`overflow-hidden transition-all duration-200 ease-in-out ${
              expandedSections.resources ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="px-6 pb-6">
              <TodoList 
                listName="Resources" 
                eventId={eventId} 
                hideHeader={true}
              />
            </div>
          </div>
        </div>

        {/* Permits Section */}
        <div className="bg-white rounded-lg border shadow-sm">
          <div 
            className="flex flex-row items-center justify-between p-6 cursor-pointer hover:bg-gray-50 rounded-t-lg transition-colors"
            onClick={() => toggleSection('permits')}
          >
            <h3 className="text-xl font-bold">Permits</h3>
            <Button variant="ghost" size="sm" className="hover:bg-transparent">
              {expandedSections.permits ? (
                <ChevronUp className="h-4 w-4 transition-transform duration-200" />
              ) : (
                <ChevronDown className="h-4 w-4 transition-transform duration-200" />
              )}
            </Button>
          </div>
          <div
            className={`overflow-hidden transition-all duration-200 ease-in-out ${
              expandedSections.permits ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="px-6 pb-6">
              <Permits 
                permits={permits} 
                // hideHeader={true}
              />
            </div>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="bg-white rounded-lg border shadow-sm">
          <div 
            className="flex flex-row items-center justify-between p-6 cursor-pointer hover:bg-gray-50 rounded-t-lg transition-colors"
            onClick={() => toggleSection('socialMedia')}
          >
            <h3 className="text-xl font-bold">Social Media</h3>
            <Button variant="ghost" size="sm" className="hover:bg-transparent">
              {expandedSections.socialMedia ? (
                <ChevronUp className="h-4 w-4 transition-transform duration-200" />
              ) : (
                <ChevronDown className="h-4 w-4 transition-transform duration-200" />
              )}
            </Button>
          </div>
          <div
            className={`overflow-hidden transition-all duration-200 ease-in-out ${
              expandedSections.socialMedia ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="px-6 pb-6">
              <SocialMedia 
                eventId={eventId} 
                // hideHeader={true}
              />
            </div>
          </div>
        </div>

        {/* Outreach Section */}
        {outreachTemplates.map((template) => (
          <div key={template.id} className="bg-white rounded-lg border shadow-sm p-6">
            <Outreach
              defaultText={template.subject}
              defaultSubject={template.subject}
              templateId={template.id}
              onComplete={handleOutreachComplete}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetailsView;
