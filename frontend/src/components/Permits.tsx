import React, { useState } from 'react';

interface Permit {
  id: number;
  text: string;
  completed: boolean;
}

interface PermitsProps {
  permits: Permit[];
}

const Permits: React.FC<PermitsProps> = ({ permits }) => {
  const [localPermits, setLocalPermits] = useState<Permit[]>(permits);
  const [updatingPermitId, setUpdatingPermitId] = useState<number | null>(null);

  const handlePermitClick = (id: number) => {
    const permit = localPermits.find(permit => permit.id === id);
    if (!permit || permit.completed) return;
    
    // Set loading state for the clicked permit
    setUpdatingPermitId(id);

    // Simulate delay before marking permit as completed.
    setTimeout(() => {
      setLocalPermits(prev =>
        prev.map(p => (p.id === id ? { ...p, completed: true } : p))
      );
      setUpdatingPermitId(null);
    }, 1000); // 1 second delay
  };

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Permits</h2>
      <ul className="space-y-2">
        {localPermits.map(permit => (
          <li
            key={permit.id}
            className="flex items-center justify-between border p-2 rounded"
          >
            <span>{permit.text}</span>
            <button
              className="w-8 h-8 rounded-full border flex items-center justify-center"
              onClick={() => handlePermitClick(permit.id)}
              disabled={permit.completed || updatingPermitId === permit.id}
            >
              {updatingPermitId === permit.id ? (
                <svg
                  className="animate-spin h-5 w-5 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
              ) : permit.completed ? (
                "✔️"
              ) : (
                "➡️"
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Permits;