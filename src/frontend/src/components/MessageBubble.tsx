import { Message } from '../backend';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { format } from 'date-fns';

interface MessageBubbleProps {
  message: Message;
  otherUserName?: string;
}

export default function MessageBubble({ message, otherUserName }: MessageBubbleProps) {
  const { identity } = useInternetIdentity();
  const isOwnMessage = identity && message.sender.toString() === identity.getPrincipal().toString();

  const timestamp = new Date(Number(message.timestamp) / 1000000);

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[70%] ${isOwnMessage ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div
          className={`rounded-2xl px-4 py-2 ${
            isOwnMessage
              ? 'bg-primary text-primary-foreground rounded-br-sm'
              : 'bg-muted text-foreground rounded-bl-sm'
          }`}
        >
          <p className="text-sm break-words">{message.content}</p>
        </div>
        <div className="flex items-center gap-2 px-2">
          <span className="text-xs text-muted-foreground">
            {isOwnMessage ? 'You' : otherUserName || 'User'}
          </span>
          <span className="text-xs text-muted-foreground">{format(timestamp, 'MMM d, h:mm a')}</span>
        </div>
      </div>
    </div>
  );
}
