import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import TodoList from "../components/TodoList";
import Permits from "@/components/Permits";
import SocialMedia from "@/components/SocialMedia";
import Outreach from "@/components/Outreach";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ChevronDown,
  Calendar,
  FileCheck,
  Share2,
  Users,
} from "lucide-react";

interface TodoListProps {
  eventId?: string;
  className?: string;
}

interface PermitsProps {
  permits: { id: number; text: string; completed: boolean }[];
  className?: string;
}

interface SocialMediaProps {
  eventId?: string;
  className?: string;
}

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
  const [outreachTemplates, setOutreachTemplates] = useState<OutreachTemplate[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  // Which sections are expanded
  const [expandedSections, setExpandedSections] = useState({
    resources: false,
    permits: false,
    socialMedia: false,
  });

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchOutreachTemplates = async () => {
      try {
        const response = await fetch("http://localhost:5001/volunteer_outreach", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ eventId }),
        });
        const data = await response.json();
        setOutreachTemplates(data);
      } catch (error) {
        console.error("Error fetching outreach templates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOutreachTemplates();
  }, [eventId]);

  const handleOutreachComplete = (templateId: string) => {
    setOutreachTemplates((templates) =>
      templates.filter((template) => template.id !== templateId)
    );
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
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
    <>
      <style>
        {`
          .bg-neutral-800 [data-state="closed"],
          .bg-neutral-800 [data-state="open"],
          .bg-neutral-800 [data-state="closed"] > div,
          .bg-neutral-800 [data-state="open"] > div,
          .bg-neutral-800 .p-4,
          .bg-neutral-800 .shadow,
          .bg-neutral-800 .rounded {
            background-color: rgb(38 38 38) !important;
            color: white !important;
          }
        `}
      </style>

      {/* Entire page is scrollable below */}
      <div className="flex flex-row min-h-screen w-full overflow-y-auto">
        {/* Left Section (30%) */}
        <div className="w-[30%] bg-gradient-to-b from-black to-neutral-900 p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="w-[90%] max-w-md bg-neutral-900/50 backdrop-blur-sm border-neutral-800/50 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Event Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit...
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Section (70%) */}
        <div className="w-[70%] bg-white p-6 space-y-16">
          {/* Resources Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="bg-neutral-800 backdrop-blur-sm border-neutral-700/50 shadow-2xl hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <FileCheck className="w-5 h-5 text-blue-400" />
                    <h3 className="text-xl font-bold text-neutral-200">
                      Resources
                    </h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-neutral-200 hover:bg-neutral-700"
                    onClick={() => toggleSection("resources")}
                  >
                    <motion.div
                      animate={{ rotate: expandedSections.resources ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </motion.div>
                  </Button>
                </div>
                {/* Conditionally show the TodoList so the checkbox appears immediately when expanded */}
                {expandedSections.resources && (
                  <TodoList
                    eventId={eventId}
                    className="bg-neutral-800 text-white"
                  />
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Permits Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-neutral-800 backdrop-blur-sm border-neutral-700/50 shadow-2xl hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Share2 className="w-5 h-5 text-purple-400" />
                    <h3 className="text-xl font-bold text-neutral-200">
                      Permits
                    </h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-neutral-200 hover:bg-neutral-700"
                    onClick={() => toggleSection("permits")}
                  >
                    <motion.div
                      animate={{ rotate: expandedSections.permits ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </motion.div>
                  </Button>
                </div>
                {expandedSections.permits && (
                  <Permits
                    permits={permits}
                    className="bg-neutral-800 text-white"
                  />
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Social Media Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="bg-neutral-800 backdrop-blur-sm border-neutral-700/50 shadow-2xl hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-green-400" />
                    <h3 className="text-xl font-bold text-neutral-200">
                      Social Media
                    </h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-neutral-200 hover:bg-neutral-700"
                    onClick={() => toggleSection("socialMedia")}
                  >
                    <motion.div
                      animate={{
                        rotate: expandedSections.socialMedia ? 180 : 0,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </motion.div>
                  </Button>
                </div>
                {expandedSections.socialMedia && (
                  <SocialMedia
                    eventId={eventId}
                    className="bg-neutral-800 text-white"
                  />
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Outreach Section */}
          {paginatedOutreachTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              className="transform-gpu"
            >
              <Card className="bg-neutral-800 backdrop-blur-sm border-neutral-700/50 shadow-2xl hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                <CardContent className="p-6 bg-neutral-800 text-white">
                  <Outreach
                    defaultText={template.subject}
                    defaultSubject={template.subject}
                    templateId={template.id}
                    onComplete={handleOutreachComplete}
                  />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
};

export default DetailsView;