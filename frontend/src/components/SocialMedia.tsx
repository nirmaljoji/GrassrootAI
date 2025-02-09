import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

interface SocialMediaItem {
  type: "facebook" | "x" | "instagram";
  group_name: string;
  completed: boolean;
}

interface SocialMediaProps {
  eventId?: string;
}

const getSocialIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "facebook":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          width="100"
          height="100"
          viewBox="0 0 46 46"
          className="w-4 h-4 mr-2"
        >
          <path d="M 9 4 C 6.2504839 4 4 6.2504839 4 9 L 4 41 C 4 43.749516 6.2504839 46 9 46 L 25.832031 46 A 1.0001 1.0001 0 0 0 26.158203 46 L 31.832031 46 A 1.0001 1.0001 0 0 0 32.158203 46 L 41 46 C 43.749516 46 46 43.749516 46 41 L 46 9 C 46 6.2504839 43.749516 4 41 4 L 9 4 z M 9 6 L 41 6 C 42.668484 6 44 7.3315161 44 9 L 44 41 C 44 42.668484 42.668484 44 41 44 L 33 44 L 33 30 L 36.820312 30 L 38.220703 23 L 33 23 L 33 21 C 33 20.442508 33.05305 20.398929 33.240234 20.277344 C 33.427419 20.155758 34.005822 20 35 20 L 38 20 L 38 14.369141 L 37.429688 14.097656 C 37.429688 14.097656 35.132647 13 32 13 C 29.75 13 27.901588 13.896453 26.71875 15.375 C 25.535912 16.853547 25 18.833333 25 21 L 25 23 L 22 23 L 22 30 L 25 30 L 25 44 L 9 44 C 7.3315161 44 6 42.668484 6 41 L 6 9 C 6 7.3315161 7.3315161 6 9 6 z M 32 15 C 34.079062 15 35.38736 15.458455 36 15.701172 L 36 18 L 35 18 C 33.849178 18 32.926956 18.0952 32.150391 18.599609 C 31.373826 19.104024 31 20.061492 31 21 L 31 25 L 35.779297 25 L 35.179688 28 L 31 28 L 31 44 L 27 44 L 27 28 L 24 28 L 24 25 L 27 25 L 27 21 C 27 19.166667 27.464088 17.646453 28.28125 16.625 C 29.098412 15.603547 30.25 15 32 15 z"></path>
        </svg>
      );
    case "x":
      return (
        <svg
          viewBox="0 0 1200 1227"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          role="none"
          className="w-4 h-4 mr-2"
        >
          <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z"></path>
        </svg>
      );
    case "instagram":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 mr-2"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm10 2a3 3 0 013 3v10a3 3 0 01-3 3H7a3 3 0 01-3-3V7a3 3 0 013-3h10zm-5 3a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm4.5-.5a1 1 0 100 2 1 1 0 000-2z" />
        </svg>
      );
    default:
      return null;
  }
};

const SocialMediaRow: React.FC<{ item: SocialMediaItem; eventId?: string }> = ({ item, eventId }) => {
  const [completed, setCompleted] = useState(item.completed);
  const [loading, setLoading] = useState(false);

  const handlePost = async () => {
    if (!completed && !loading) {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5001/social_outreach', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            eventId,
            type: item.type,
            group_name: item.group_name
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to post to social media');
        }

        setCompleted(true);
      } catch (error) {
        console.error('Error posting to social media:', error);
        // Optionally show an error message to the user
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <li className="flex items-center justify-between py-3 border-b last:border-b-0">
      <div className="flex items-center">
        {getSocialIcon(item.type)}
        <span className="font-medium">{item.group_name}</span>
      </div>
      <div>
        {completed ? (
          <Button variant="ghost" disabled className="text-green-600">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Done
          </Button>
        ) : loading ? (
          <Button disabled>
            <Spinner className="mr-2 h-4 w-4" />
            Posting...
          </Button>
        ) : (
          <Button onClick={handlePost}>Post</Button>
        )}
      </div>
    </li>
  );
};

const SocialMedia: React.FC<SocialMediaProps> = ({ eventId }) => {
  const [socialMediaItems, setSocialMediaItems] = useState<SocialMediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSocialMedia = async () => {
      try {
        const response = await fetch('http://localhost:5001/social_outreach', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ eventId }),
        });
        
        const data = await response.json();
        
        // Transform the data and set default type if not available
        const transformedData = data.map((item: any) => ({
          type: (item.type?.toLowerCase() || 'facebook') as "facebook" | "x" | "instagram",
          title: item.title,
          completed: item.completed || false,
        }));
        
        setSocialMediaItems(transformedData);
      } catch (error) {
        console.error('Error fetching social media items:', error);
        setSocialMediaItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSocialMedia();
  }, [eventId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Social Media</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Spinner className="h-6 w-6" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Media</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="divide-y divide-gray-100">
          {socialMediaItems.map((item, index) => (
            <SocialMediaRow key={index} item={item} eventId={eventId} />
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default SocialMedia;
