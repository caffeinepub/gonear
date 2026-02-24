import { useMatches, useGetCallerUserProfile } from '../hooks/useQueries';
import MatchCard from '../components/MatchCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function MatchesPage() {
  const { data: matches = [], isLoading } = useMatches();
  const { data: profile } = useGetCallerUserProfile();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Your Matches</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!profile?.verified) {
    return (
      <div className="max-w-2xl mx-auto">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Your profile is pending verification. You'll be able to see matches once an admin verifies your profile.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Your Matches</h1>
        <p className="text-muted-foreground">
          Find professionals who want to swap to your city while you move to theirs
        </p>
      </div>

      {matches.length === 0 ? (
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted">
                <Users className="w-8 h-8 text-muted-foreground" />
              </div>
            </div>
            <CardTitle>No Matches Yet</CardTitle>
            <CardDescription>
              We couldn't find any matches for your profile at the moment. Check back later or update your preferences.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {matches.map((principal) => (
            <MatchCard key={principal.toString()} principal={principal} />
          ))}
        </div>
      )}
    </div>
  );
}
