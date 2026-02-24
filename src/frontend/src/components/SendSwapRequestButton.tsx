import { Button } from '@/components/ui/button';
import { useSendSwapRequest, useSwapRequests } from '../hooks/useQueries';
import { Principal } from '@dfinity/principal';
import { toast } from 'sonner';
import { Send } from 'lucide-react';
import { SwapRequestStatus } from '../backend';

interface SendSwapRequestButtonProps {
  recipient: Principal;
}

export default function SendSwapRequestButton({ recipient }: SendSwapRequestButtonProps) {
  const { data: swapRequests = [] } = useSwapRequests();
  const sendRequest = useSendSwapRequest();

  const existingRequest = swapRequests.find(
    (req) =>
      (req.from.toString() === recipient.toString() || req.to.toString() === recipient.toString()) &&
      req.status === SwapRequestStatus.pending
  );

  const handleSend = async () => {
    try {
      await sendRequest.mutateAsync(recipient);
      toast.success('Swap request sent successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send swap request');
    }
  };

  if (existingRequest) {
    return (
      <Button disabled variant="secondary" className="w-full">
        Request Already Sent
      </Button>
    );
  }

  return (
    <Button onClick={handleSend} disabled={sendRequest.isPending} className="w-full gap-2">
      <Send className="w-4 h-4" />
      {sendRequest.isPending ? 'Sending...' : 'Send Swap Request'}
    </Button>
  );
}
