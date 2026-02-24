import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Briefcase, DollarSign, TrendingUp, ArrowRight } from 'lucide-react';
import { useGetUserProfile } from '../hooks/useQueries';
import { Principal } from '@dfinity/principal';
import { ExperienceLevel } from '../backend';

interface MatchCardProps {
  principal: Principal;
}

const experienceLevelLabels: Record<ExperienceLevel, string> = {
  [ExperienceLevel.junior]: 'Junior',
  [ExperienceLevel.midLevel]: 'Mid-Level',
  [ExperienceLevel.senior]: 'Senior',
};

export default function MatchCard({ principal }: MatchCardProps) {
  const { data: profile, isLoading } = useGetUserProfile(principal);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
            <div className="h-3 bg-muted rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return null;
  }

  const handleViewDetails = () => {
    navigate({ to: '/matches/$principal', params: { principal: principal.toString() } });
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{profile.name}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{profile.companyName}</p>
          </div>
          {profile.verified && (
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              Verified
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Briefcase className="w-4 h-4 text-muted-foreground" />
          <span>{profile.jobRole}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span>
            {profile.currentCity} <ArrowRight className="w-3 h-3 inline mx-1" /> {profile.preferredCity}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <DollarSign className="w-4 h-4 text-muted-foreground" />
          <span>{profile.salaryRange}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <TrendingUp className="w-4 h-4 text-muted-foreground" />
          <span>{experienceLevelLabels[profile.experienceLevel]}</span>
        </div>

        <Button onClick={handleViewDetails} className="w-full mt-2" variant="outline">
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}
