import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface OutreachProps {
  defaultText: string;
  defaultSubject: string;
  templateId: string;
  onComplete: (templateId: string) => void;
}

const Outreach: React.FC<OutreachProps> = ({ defaultText, defaultSubject, templateId, onComplete }) => {
  const [emailBody, setEmailBody] = useState(defaultText);
  const [newEmail, setNewEmail] = useState('');
  const [emailAddresses, setEmailAddresses] = useState<string[]>([]);
  const [subject, setSubject] = useState(defaultSubject);
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

  const handleSend = async () => {
    try {
      const payload = {
        recipients: emailAddresses,
        subject: subject,
        body: emailBody
      };
      
      console.log('Sending email with payload:', payload);
      // Implement actual API call here
      
      // After successful send, remove the component
      onComplete(templateId);
      
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Outreach</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="emails">Recipients</Label>
          <Input
            id="emails"
            placeholder="Enter recipient email and press Enter..."
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            onKeyDown={handleEmailKeyDown}
          />
          {emailAddresses.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {emailAddresses.map((email, index) => (
                <Badge 
                  key={index} 
                  variant="secondary"
                  className="px-3 py-1.5 flex items-center gap-2 text-sm"
                >
                  {email}
                  <button
                    onClick={() => removeEmail(index)}
                    className="hover:text-destructive focus:outline-none"
                    aria-label={`Remove ${email}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter subject title..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            ref={textAreaRef as React.Ref<HTMLTextAreaElement>}
            value={emailBody}
            onChange={handleTextAreaChange}
            placeholder="Enter email content..."
            className="resize-none overflow-hidden min-h-[200px]"
          />
        </div>

        <Button onClick={handleSend} className="w-full">
          Send Email
        </Button>
      </CardContent>
    </Card>
  );
};

export default Outreach;