import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  Zap,
  Database,
  RefreshCw,
  Shield,
  CheckCircle2,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  const features = [
    {
      icon: Zap,
      title: 'Real-time Sync',
      description: 'Automatically sync products from Shopify to Framer CMS in real-time'
    },
    {
      icon: Database,
      title: 'CMS Integration',
      description: 'Seamless integration with Framer CMS collections and field mapping'
    },
    {
      icon: RefreshCw,
      title: 'Auto Updates',
      description: 'Keep your products up-to-date with scheduled automatic syncing'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your credentials are encrypted and stored securely in your project'
    }
  ];

  const steps = [
    'Connect your Shopify store with API credentials',
    'Select products you want to sync',
    'Configure CMS settings and field mappings',
    'Start building your store in Framer'
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <Card className="border-border/50 overflow-hidden">
        {/* Hero Section */}
        <div className="p-8 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
          <div className="text-center max-w-lg mx-auto">
            <Badge variant="secondary" className="mb-4 gap-1">
              <Sparkles className="w-3 h-3" />
              Welcome to Shopiflow
            </Badge>
            <h2 className="mb-3">Connect Shopify to Framer CMS</h2>
            <p className="text-muted-foreground">
              The easiest way to sync your Shopify products with Framer. Build beautiful 
              e-commerce sites with live product data.
            </p>
          </div>
        </div>

        <CardContent className="p-8 space-y-8">
          {/* Features Grid */}
          <div>
            <h3 className="mb-4">What you'll get</h3>
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div 
                    key={feature.title}
                    className="p-4 border border-border/50 rounded-lg hover:bg-muted/20 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <h4 style={{ fontSize: '0.875rem' }}>{feature.title}</h4>
                    </div>
                    <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* How it Works */}
          <div>
            <h3 className="mb-4">How it works</h3>
            <div className="space-y-3">
              {steps.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground flex-shrink-0 mt-0.5">
                    <span style={{ fontSize: '0.75rem' }}>{i + 1}</span>
                  </div>
                  <p className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/20 rounded-lg">
              <div className="mb-1">2 min</div>
              <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
                Setup time
              </p>
            </div>
            <div className="text-center p-4 bg-muted/20 rounded-lg">
              <div className="mb-1">100%</div>
              <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
                Secure
              </p>
            </div>
            <div className="text-center p-4 bg-muted/20 rounded-lg">
              <div className="mb-1">Live</div>
              <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
                Real-time sync
              </p>
            </div>
          </div>

          <Separator />

          {/* Requirements */}
          <div className="p-4 bg-muted/30 rounded-lg space-y-2">
            <h4 className="mb-3">Before you start</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground" style={{ fontSize: '0.875rem' }}>
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span>Admin access to your Shopify store</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground" style={{ fontSize: '0.875rem' }}>
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span>Shopify API credentials (we'll help you get these)</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground" style={{ fontSize: '0.875rem' }}>
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span>A Framer project with CMS collections enabled</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="pt-4">
            <Button 
              onClick={onGetStarted} 
              className="w-full gap-2"
              size="lg"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Button>
            <p className="text-center text-muted-foreground mt-3" style={{ fontSize: '0.75rem' }}>
              No credit card required • Free for all Framer users
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
