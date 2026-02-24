import { useConversations } from '../hooks/useQueries';
import ConversationListItem from '../components/ConversationListItem';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';

export default function MessagesPage() {
  const { data: conversations = [], isLoading } = useConversations();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Messages</h1>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-3 bg-muted rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Messages</h1>
        <p className="text-muted-foreground">Chat with users who have accepted your swap requests</p>
      </div>

      {conversations.length === 0 ? (
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted">
                <MessageSquare className="w-8 h-8 text-muted-foreground" />
              </div>
            </div>
            <CardTitle>No Conversations Yet</CardTitle>
            <CardDescription>
              You can start messaging users once you have accepted swap requests.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="space-y-2">
          {conversations.map((principal) => (
            <ConversationListItem key={principal.toString()} principal={principal} />
          ))}
        </div>
      )}
    </div>
  );
}
