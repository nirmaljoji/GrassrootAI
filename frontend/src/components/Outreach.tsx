import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

interface OutreachProps {
  defaultText: string;
}

const Outreach: React.FC<OutreachProps> = ({ defaultText }) => {
  const [emailBody, setEmailBody] = useState(defaultText);
  const [newEmail, setNewEmail] = useState('');
  const [emailAddresses, setEmailAddresses] = useState<string[]>([]);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = textAreaRef.current.scrollHeight + 'px';
    }
  }, [emailBody]);

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEmailBody(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  };

  const handleEmailKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newEmail.trim()) {
      e.preventDefault();
      setEmailAddresses([...emailAddresses, newEmail.trim()]);
      setNewEmail('');
    }
  };

  const removeEmail = (index: number) => {
    setEmailAddresses(emailAddresses.filter((_, i) => i !== index));
  };

  const handleSend = () => {
    // Implement send functionality here, using all email addresses and the email body
    console.log('Sending email to:', emailAddresses);
    console.log('Email content:', emailBody);
  };

  return (
    <div className="p-4 bg-white shadow rounded space-y-4">
      <h2 className="text-xl font-bold mb-2">Outreach</h2>
      <div className="space-y-2">
        <Input
          placeholder="Enter recipient email and press Enter..."
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          onKeyDown={handleEmailKeyDown}
          className="w-full"
        />
        <div className="flex flex-wrap gap-2">
          {emailAddresses.map((email, index) => (
            <Badge key={index} className="rounded-full flex items-center">
              {email}
              <button
                onClick={() => removeEmail(index)}
                className="ml-1 text-xs text-gray-200 hover:text-red-500 focus:outline-none"
                aria-label={`Remove ${email}`}
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
      </div>
      <Textarea
        ref={textAreaRef as React.Ref<HTMLTextAreaElement>}
        value={emailBody}
        onChange={handleTextAreaChange}
        placeholder="Enter email content..."
        className="w-full p-2 border border-gray-300 rounded resize-none overflow-hidden"
      />
      <div className="mt-4">
        <Button onClick={handleSend} className="w-full">
          Send
        </Button>
      </div>
    </div>
  );
};

export default Outreach;