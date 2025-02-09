import React from 'react';
import TodoList from '../components/TodoList';
import Permits from '@/components/Permits';
import Outreach from '@/components/Outreach';

const permits = [
  { id: 1, text: 'Permit 1', completed: false },
  { id: 2, text: 'Permit 2', completed: false }
];

const DetailsView: React.FC = () => {
    return (
        <div className="grid grid-cols-3 gap-4 p-4 h-screen">
            <div className="col-span-1 bg-gray-100 p-4 space-y-4 h-full overflow-y-auto">
                {/* First Column - 1/3 of space */}
                <h2 className="text-xl font-bold mb-4">Column 1</h2>
                <p>Content for the first column.</p>
                {/* Add more content here to test independent scrolling */}
            </div>
            <div className="col-span-2 bg-gray-200 p-4 space-y-4 h-full overflow-y-auto">
                {/* Second Column - 2/3 of space */}
                <h2 className="text-xl font-bold mb-4">Column 2</h2>
                <p>Content for the second column.</p>
                <TodoList listName='Resources'/>
                <TodoList listName='Resources'/>
                <TodoList listName='Resources'/>
                <Permits permits={permits}/>
                <Outreach />
                {/* Add more content here to test independent scrolling */}
            </div>
        </div>
    );
};

export default DetailsView;