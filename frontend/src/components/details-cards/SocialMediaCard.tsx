import React from 'react';
import { Share2, Facebook, Instagram, Twitter, Linkedin, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

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

const SocialMediaCard = () => {
  return (
    <AccordionItem value="social" className="border rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 bg-white overflow-hidden z-10">
      <Card className="p-0">
        <AccordionTrigger className="px-6 py-4 hover:no-underline">
          <div className="flex items-center space-x-3">
            <Share2 className="h-5 w-5 text-purple-600" />
            <h2 className="text-xl font-semibold">Social Media</h2>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-6 pb-4">
          <div className="space-y-6 pt-2">
            <p className="text-gray-600">Manage your social media campaigns and posts.</p>
            
            {/* First Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Facebook Card */}
              <div className="p-4 rounded-lg border bg-blue-50 hover:bg-blue-100 transition-colors">
                <div className="flex items-center space-x-2 mb-3">
                  <Facebook className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-900">Facebook Groups</h3>
                </div>
                <div className="space-y-2">
                  {socialMediaData.facebook.groups.map((group, index) => (
                    <div key={index} className="text-sm text-blue-800 bg-blue-200/50 p-2 rounded">
                      {group}
                    </div>
                  ))}
                </div>
              </div>

              {/* Instagram Card */}
              <div className="p-4 rounded-lg border bg-pink-50 hover:bg-pink-100 transition-colors">
                <div className="flex items-center space-x-2 mb-3">
                  <Instagram className="h-5 w-5 text-pink-600" />
                  <h3 className="font-semibold text-pink-900">Instagram</h3>
                </div>
                <div className="space-y-3">
                  <p className="text-sm text-pink-800 bg-pink-200/50 p-3 rounded">
                    {socialMediaData.instagram.sampleMessage}
                  </p>
                  <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
                    <Send className="h-4 w-4 mr-2" /> Create Post
                  </Button>
                </div>
              </div>
            </div>

            {/* Second Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Twitter/X Card */}
              <div className="p-4 rounded-lg border bg-neutral-50 hover:bg-neutral-100 transition-colors">
                <div className="flex items-center space-x-2 mb-3">
                  <Twitter className="h-5 w-5 text-neutral-900" />
                  <h3 className="font-semibold text-neutral-900">X (Twitter)</h3>
                </div>
                <div className="space-y-3">
                  <p className="text-sm text-neutral-800 bg-neutral-200/50 p-3 rounded">
                    {socialMediaData.twitter.tweet}
                  </p>
                  <Button variant="outline" className="w-full border-neutral-900 text-neutral-900 hover:bg-neutral-200">
                    <Send className="h-4 w-4 mr-2" /> Post Tweet
                  </Button>
                </div>
              </div>

              {/* LinkedIn Card */}
              <div className="p-4 rounded-lg border bg-blue-50 hover:bg-blue-100 transition-colors">
                <div className="flex items-center space-x-2 mb-3">
                  <Linkedin className="h-5 w-5 text-blue-700" />
                  <h3 className="font-semibold text-blue-900">LinkedIn</h3>
                </div>
                <div className="space-y-3">
                  <p className="text-sm text-blue-800 bg-blue-200/50 p-3 rounded">
                    {socialMediaData.linkedin.message}
                  </p>
                  <Button className="w-full bg-blue-700 hover:bg-blue-800">
                    <Send className="h-4 w-4 mr-2" /> Share Post
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </AccordionContent>
      </Card>
    </AccordionItem>
  );
};

export default SocialMediaCard; 