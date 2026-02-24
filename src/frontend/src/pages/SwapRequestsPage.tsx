import { useSwapRequests } from '../hooks/useQueries';
import SwapRequestCard from '../components/SwapRequestCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeftRight } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function SwapRequestsPage() {
  const { data: requests = [], isLoading } = useSwapRequests();
  const { identity } = useInternetIdentity();

  const incomingRequests = requests.filter(
    (req) => identity && req.to.toString() === identity.getPrincipal().toString()
  );

  const outgoingRequests = requests.filter(
    (req) => identity && req.from.toString() === identity.getPrincipal().toString()
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Swap Requests</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Swap Requests</h1>
        <p className="text-muted-foreground">Manage your incoming and outgoing job swap requests</p>
      </div>

      <Tabs defaultValue="incoming" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="incoming">
            Incoming ({incomingRequests.length})
          </TabsTrigger>
          <TabsTrigger value="outgoing">
            Outgoing ({outgoingRequests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="incoming" className="mt-6">
          {incomingRequests.length === 0 ? (
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted">
                    <ArrowLeftRight className="w-8 h-8 text-muted-foreground" />
                  </div>
                </div>
                <CardTitle>No Incoming Requests</CardTitle>
                <CardDescription>
                  You don't have any incoming swap requests at the moment.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {incomingRequests.map((request) => (
                <SwapRequestCard key={request.id.toString()} request={request} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="outgoing" className="mt-6">
          {outgoingRequests.length === 0 ? (
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted">
                    <ArrowLeftRight className="w-8 h-8 text-muted-foreground" />
                  </div>
                </div>
                <CardTitle>No Outgoing Requests</CardTitle>
                <CardDescription>
                  You haven't sent any swap requests yet. Browse matches to get started!
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {outgoingRequests.map((request) => (
                <SwapRequestCard key={request.id.toString()} request={request} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
