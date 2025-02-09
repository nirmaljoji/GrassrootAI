import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2, ChevronRight, Check, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";

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
  const [isOpen, setIsOpen] = useState(true);
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
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="p-6">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Permits</h2>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="hover:bg-transparent">
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 transition-transform duration-200" />
                ) : (
                  <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
          
          <CollapsibleContent className="pt-4">
            {localPermits.length > 0 ? (
              <ul className="space-y-2">
                {localPermits.map(permit => (
                  <li
                    key={permit.id}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg border",
                      permit.completed && "bg-muted"
                    )}
                  >
                    <span className={cn(
                      "text-sm",
                      permit.completed && "text-muted-foreground line-through"
                    )}>
                      {permit.text}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePermitClick(permit.id)}
                      disabled={permit.completed || updatingPermitId === permit.id}
                      className="h-8 w-8 rounded-full"
                    >
                      {updatingPermitId === permit.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : permit.completed ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-sm">No permits available.</p>
            )}
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default Permits;