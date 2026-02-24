import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { ExperienceLevel } from '../backend';
import { toast } from 'sonner';

export default function ProfileSetupModal() {
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [currentCity, setCurrentCity] = useState('');
  const [preferredCity, setPreferredCity] = useState('');
  const [salaryRange, setSalaryRange] = useState('');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(ExperienceLevel.midLevel);

  const saveProfile = useSaveCallerUserProfile();

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
        verified: false,
      });
      toast.success('Profile created successfully! Please wait for admin verification.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create profile');
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Welcome to GoNear!</DialogTitle>
          <DialogDescription>Let's set up your profile to find job swap matches.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
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
            {saveProfile.isPending ? 'Creating Profile...' : 'Create Profile'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
