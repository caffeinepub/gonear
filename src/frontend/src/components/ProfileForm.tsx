import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { ExperienceLevel, UserProfile } from '../backend';
import { toast } from 'sonner';

interface ProfileFormProps {
  initialProfile?: UserProfile;
}

export default function ProfileForm({ initialProfile }: ProfileFormProps) {
  const [name, setName] = useState(initialProfile?.name || '');
  const [companyName, setCompanyName] = useState(initialProfile?.companyName || '');
  const [jobRole, setJobRole] = useState(initialProfile?.jobRole || '');
  const [currentCity, setCurrentCity] = useState(initialProfile?.currentCity || '');
  const [preferredCity, setPreferredCity] = useState(initialProfile?.preferredCity || '');
  const [salaryRange, setSalaryRange] = useState(initialProfile?.salaryRange || '');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(
    initialProfile?.experienceLevel || ExperienceLevel.midLevel
  );

  const saveProfile = useSaveCallerUserProfile();

  useEffect(() => {
    if (initialProfile) {
      setName(initialProfile.name);
      setCompanyName(initialProfile.companyName);
      setJobRole(initialProfile.jobRole);
      setCurrentCity(initialProfile.currentCity);
      setPreferredCity(initialProfile.preferredCity);
      setSalaryRange(initialProfile.salaryRange);
      setExperienceLevel(initialProfile.experienceLevel);
    }
  }, [initialProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !companyName || !jobRole || !currentCity || !preferredCity || !salaryRange) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await saveProfile.mutateAsync({
        name,
        companyName,
        jobRole,
        currentCity,
        preferredCity,
        salaryRange,
        experienceLevel,
        verified: initialProfile?.verified || false,
      });
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Profile</CardTitle>
        <CardDescription>Update your job swap preferences and information.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name *</Label>
            <Input
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Tech Corp"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobRole">Job Role *</Label>
            <Input
              id="jobRole"
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              placeholder="Software Engineer"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentCity">Current City *</Label>
              <Input
                id="currentCity"
                value={currentCity}
                onChange={(e) => setCurrentCity(e.target.value)}
                placeholder="San Francisco"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferredCity">Preferred City *</Label>
              <Input
                id="preferredCity"
                value={preferredCity}
                onChange={(e) => setPreferredCity(e.target.value)}
                placeholder="New York"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="salaryRange">Salary Range *</Label>
            <Input
              id="salaryRange"
              value={salaryRange}
              onChange={(e) => setSalaryRange(e.target.value)}
              placeholder="$80k - $120k"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="experienceLevel">Experience Level *</Label>
            <Select
              value={experienceLevel}
              onValueChange={(value) => setExperienceLevel(value as ExperienceLevel)}
            >
              <SelectTrigger id="experienceLevel">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ExperienceLevel.junior}>Junior</SelectItem>
                <SelectItem value={ExperienceLevel.midLevel}>Mid-Level</SelectItem>
                <SelectItem value={ExperienceLevel.senior}>Senior</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" disabled={saveProfile.isPending}>
            {saveProfile.isPending ? 'Saving...' : 'Save Profile'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
