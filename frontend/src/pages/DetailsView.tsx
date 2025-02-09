import React from "react";
import { useParams } from "react-router";
import TodoList from "../components/TodoList";
import Permits from "@/components/Permits";
import SocialMedia from "@/components/SocialMedia";
import Outreach from "@/components/Outreach";

const permits = [
  { id: 1, text: "Permit 1", completed: false },
  { id: 2, text: "Permit 2", completed: false },
];

const DetailsView: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  return (
    <div className="grid grid-cols-3 gap-4 p-4 h-screen">
      <div className="col-span-1 bg-gray-100 p-4 space-y-4 h-full overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Column 1</h2>
        <p>Content for the first column.</p>
      </div>
      <div className="col-span-2 bg-gray-200 p-4 space-y-4 h-full overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          Column 2 {eventId && `(Event ID: ${eventId})`}
        </h2>
        <p>Content for the second column.</p>
        <h1>Event Id = {eventId ?? ""}</h1>
        <TodoList listName="Resources" eventId={eventId}/>
        <Permits permits={permits} />
        <SocialMedia />
        <Outreach defaultText="" />
      </div>
    </div>
  );
};

export default DetailsView;
