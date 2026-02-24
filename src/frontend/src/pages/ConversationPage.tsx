import { useParams, Link } from '@tanstack/react-router';
import { useMessages, useGetUserProfile } from '../hooks/useQueries';
import MessageBubble from '../components/MessageBubble';
import MessageInput from '../components/MessageInput';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Principal } from '@dfinity/principal';
import { useEffect, useRef } from 'react';

export default function ConversationPage() {
  const { principal: principalString } = useParams({ from: '/messages/$principal' });
  const principal = Principal.fromText(principalString);
  const { data: messages = [], isLoading } = useMessages(principal);
  const { data: profile } = useGetUserProfile(principal);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex items-center gap-4">
        <Link to="/messages">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">{profile?.name || 'Loading...'}</h1>
          {profile && (
            <p className="text-sm text-muted-foreground">
              {profile.jobRole} at {profile.companyName}
            </p>
          )}
        </div>
      </div>

      <Card className="flex flex-col h-[calc(100vh-16rem)]">
        <CardContent className="flex-1 overflow-y-auto p-6">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-center">
              <div>
                <p className="text-muted-foreground">No messages yet</p>
                <p className="text-sm text-muted-foreground mt-1">Start the conversation!</p>
              </div>
            </div>
          ) : (
            <div>
              {messages.map((message, index) => (
                <MessageBubble key={index} message={message} otherUserName={profile?.name} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </CardContent>
        <div className="border-t p-4">
          <MessageInput recipient={principal} />
        </div>
      </Card>
    </div>
  );
}
