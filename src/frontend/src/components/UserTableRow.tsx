import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { useVerifyProfile, useBlockUser } from '../hooks/useQueries';
import { UserProfile } from '../backend';
import { Principal } from '@dfinity/principal';
import { CheckCircle, XCircle, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { ExperienceLevel } from '../backend';

interface UserTableRowProps {
  principal: Principal;
  profile: UserProfile;
}

const experienceLevelLabels: Record<ExperienceLevel, string> = {
  [ExperienceLevel.junior]: 'Junior',
  [ExperienceLevel.midLevel]: 'Mid-Level',
  [ExperienceLevel.senior]: 'Senior',
};

export default function UserTableRow({ principal, profile }: UserTableRowProps) {
  const verifyProfile = useVerifyProfile();
  const blockUser = useBlockUser();

  const handleVerify = async () => {
    try {
      await verifyProfile.mutateAsync(principal);
      toast.success('Profile verified successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to verify profile');
    }
  };

  const handleBlock = async () => {
    if (!confirm(`Are you sure you want to block ${profile.name}? This will delete their profile and all associated data.`)) {
      return;
    }

    try {
      await blockUser.mutateAsync(principal);
      toast.success('User blocked successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to block user');
    }
  };

  return (
    <TableRow>
      <TableCell className="font-medium">{profile.name}</TableCell>
      <TableCell>{profile.companyName}</TableCell>
      <TableCell>{profile.jobRole}</TableCell>
      <TableCell>
        {profile.currentCity} → {profile.preferredCity}
      </TableCell>
      <TableCell>{profile.salaryRange}</TableCell>
      <TableCell>{experienceLevelLabels[profile.experienceLevel]}</TableCell>
      <TableCell>
        {profile.verified ? (
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        ) : (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            <Shield className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        )}
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          {!profile.verified && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleVerify}
              disabled={verifyProfile.isPending}
            >
              Verify
            </Button>
          )}
          <Button
            size="sm"
            variant="destructive"
            onClick={handleBlock}
            disabled={blockUser.isPending}
          >
            <XCircle className="w-4 h-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
