import React from 'react';
import TodoList from '../components/TodoList';
import Permits from '@/components/Permits';
import SocialMedia from '@/components/SocialMedia';

const permits = [
  { id: 1, text: 'Permit 1', completed: false },
  { id: 2, text: 'Permit 2', completed: false }
];

const DetailsView: React.FC = () => {
    return (
        <div className="grid grid-cols-3 gap-4 p-4 h-screen">
            <div className="col-span-1 bg-gray-100 p-4 space-y-4 h-full overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Column 1</h2>
                <p>Content for the first column.</p>
            </div>
            <div className="col-span-2 bg-gray-200 p-4 space-y-4 h-full overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Column 2</h2>
                <p>Content for the second column.</p>
                <TodoList listName='Resources'/>
                <Permits permits={permits}/>
                <SocialMedia />
            </div>
        </div>
    );
};

export default DetailsView;