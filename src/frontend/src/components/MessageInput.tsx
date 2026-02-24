import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSendMessage } from '../hooks/useQueries';
import { Principal } from '@dfinity/principal';
import { Send } from 'lucide-react';
import { toast } from 'sonner';

interface MessageInputProps {
  recipient: Principal;
}

export default function MessageInput({ recipient }: MessageInputProps) {
  const [content, setContent] = useState('');
  const sendMessage = useSendMessage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      return;
    }

    try {
      await sendMessage.mutateAsync({ recipient, content: content.trim() });
      setContent('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send message');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type a message..."
        disabled={sendMessage.isPending}
        className="flex-1"
      />
      <Button type="submit" disabled={sendMessage.isPending || !content.trim()} size="icon">
        <Send className="w-4 h-4" />
      </Button>
    </form>
  );
}
