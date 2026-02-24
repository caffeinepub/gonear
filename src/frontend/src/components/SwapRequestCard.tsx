import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGetUserProfile, useAcceptSwapRequest, useRejectSwapRequest } from '../hooks/useQueries';
import { SwapRequest, SwapRequestStatus } from '../backend';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Check, X, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface SwapRequestCardProps {
  request: SwapRequest;
}

const statusLabels: Record<SwapRequestStatus, string> = {
  [SwapRequestStatus.pending]: 'Pending',
  [SwapRequestStatus.accepted]: 'Accepted',
  [SwapRequestStatus.rejected]: 'Rejected',
};

const statusColors: Record<SwapRequestStatus, string> = {
  [SwapRequestStatus.pending]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  [SwapRequestStatus.accepted]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  [SwapRequestStatus.rejected]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export default function SwapRequestCard({ request }: SwapRequestCardProps) {
  const { identity } = useInternetIdentity();
  const isIncoming = identity && request.to.toString() === identity.getPrincipal().toString();
  const otherPrincipal = isIncoming ? request.from : request.to;

  const { data: profile } = useGetUserProfile(otherPrincipal);
  const acceptRequest = useAcceptSwapRequest();
  const rejectRequest = useRejectSwapRequest();

  const handleAccept = async () => {
    try {
      await acceptRequest.mutateAsync(request.id);
      toast.success('Swap request accepted!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to accept request');
    }
  };

  const handleReject = async () => {
    try {
      await rejectRequest.mutateAsync(request.id);
      toast.success('Swap request rejected');
    } catch (error: any) {
      toast.error(error.message || 'Failed to reject request');
    }
  };

  const status = request.status;
  const isPending = status === SwapRequestStatus.pending;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{profile?.name || 'Loading...'}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {isIncoming ? 'Incoming Request' : 'Outgoing Request'}
            </p>
          </div>
          <Badge className={statusColors[status]}>
            {status === SwapRequestStatus.pending && <Clock className="w-3 h-3 mr-1" />}
            {statusLabels[status]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {profile && (
          <div className="space-y-2 text-sm mb-4">
            <p>
              <span className="font-medium">Company:</span> {profile.companyName}
            </p>
            <p>
              <span className="font-medium">Role:</span> {profile.jobRole}
            </p>
            <p>
              <span className="font-medium">Location:</span> {profile.currentCity} → {profile.preferredCity}
            </p>
          </div>
        )}

        {isIncoming && isPending && (
          <div className="flex gap-2">
            <Button
              onClick={handleAccept}
              disabled={acceptRequest.isPending}
              className="flex-1 gap-2"
              variant="default"
            >
              <Check className="w-4 h-4" />
              Accept
            </Button>
            <Button
              onClick={handleReject}
              disabled={rejectRequest.isPending}
              className="flex-1 gap-2"
              variant="destructive"
            >
              <X className="w-4 h-4" />
              Reject
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
