import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetUserProfile } from '../hooks/useQueries';
import SendSwapRequestButton from '../components/SendSwapRequestButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Briefcase, DollarSign, TrendingUp, Building2, MessageSquare } from 'lucide-react';
import { Principal } from '@dfinity/principal';
import { ExperienceLevel } from '../backend';

const experienceLevelLabels: Record<ExperienceLevel, string> = {
  [ExperienceLevel.junior]: 'Junior',
  [ExperienceLevel.midLevel]: 'Mid-Level',
  [ExperienceLevel.senior]: 'Senior',
};

export default function MatchDetailPage() {
  const { principal: principalString } = useParams({ from: '/matches/$principal' });
  const principal = Principal.fromText(principalString);
  const { data: profile, isLoading } = useGetUserProfile(principal);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-muted rounded w-1/2"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Profile Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate({ to: '/' })}>Back to Matches</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSendMessage = () => {
    navigate({ to: '/messages/$principal', params: { principal: principal.toString() } });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/' })}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-3xl font-bold">Match Details</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{profile.name}</CardTitle>
              <p className="text-muted-foreground mt-1">Looking to swap jobs</p>
            </div>
            {profile.verified && (
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                Verified
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Company</p>
                  <p className="font-medium">{profile.companyName}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Briefcase className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Job Role</p>
                  <p className="font-medium">{profile.jobRole}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Experience Level</p>
                  <p className="font-medium">{experienceLevelLabels[profile.experienceLevel]}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Current City</p>
                  <p className="font-medium">{profile.currentCity}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Preferred City</p>
                  <p className="font-medium text-primary">{profile.preferredCity}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <DollarSign className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Salary Range</p>
                  <p className="font-medium">{profile.salaryRange}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t space-y-3">
            <SendSwapRequestButton recipient={principal} />
            <Button onClick={handleSendMessage} variant="outline" className="w-full gap-2">
              <MessageSquare className="w-4 h-4" />
              Send Message
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
