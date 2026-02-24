import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Users, ArrowLeftRight, MessageSquare, Shield } from 'lucide-react';

export default function LoginPage() {
  const { login, loginStatus } = useInternetIdentity();

  const features = [
    {
      icon: Users,
      title: 'Find Matches',
      description: 'Connect with professionals who want to swap jobs in your company and role',
    },
    {
      icon: ArrowLeftRight,
      title: 'Send Swap Requests',
      description: 'Initiate job swaps with verified users in your preferred city',
    },
    {
      icon: MessageSquare,
      title: 'Direct Messaging',
      description: 'Chat with matched users to discuss swap details',
    },
    {
      icon: Shield,
      title: 'Verified Profiles',
      description: 'All profiles are verified by admins for authenticity',
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground font-bold text-2xl">
              GN
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2">Welcome to GoNear</h1>
          <p className="text-lg text-muted-foreground">
            The platform for professionals to swap jobs within the same company
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader className="text-center">
            <CardTitle>Get Started</CardTitle>
            <CardDescription>Sign in with Internet Identity to access your account</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button
              onClick={login}
              disabled={loginStatus === 'logging-in'}
              size="lg"
              className="w-full max-w-xs"
            >
              {loginStatus === 'logging-in' ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2"></div>
                  Logging in...
                </>
              ) : (
                'Login with Internet Identity'
              )}
            </Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
                      <Icon className="w-5 h-5" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
