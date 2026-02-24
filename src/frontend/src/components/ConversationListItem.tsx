import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent } from '@/components/ui/card';
import { useGetUserProfile } from '../hooks/useQueries';
import { Principal } from '@dfinity/principal';
import { MessageSquare } from 'lucide-react';

interface ConversationListItemProps {
  principal: Principal;
}

export default function ConversationListItem({ principal }: ConversationListItemProps) {
  const { data: profile } = useGetUserProfile(principal);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate({ to: '/messages/$principal', params: { principal: principal.toString() } });
  };

  return (
    <Card className="hover:bg-accent transition-colors cursor-pointer" onClick={handleClick}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{profile?.name || 'Loading...'}</p>
            {profile && (
              <p className="text-sm text-muted-foreground truncate">
                {profile.jobRole} at {profile.companyName}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
