import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';
import { Info, ExternalLink, Key, Shield, CheckCircle } from 'lucide-react';

export function ApiKeyInstructions() {
  return (
    <Card className="border-border/50">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/5 rounded-lg">
            <Key className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle>How to Get Your API Keys</CardTitle>
            <CardDescription>Follow these steps to connect your Shopify store</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="bg-muted/30 border-border/50">
          <Info className="h-4 w-4" />
          <AlertDescription>
            You'll need admin access to your Shopify store to generate API credentials
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <h4>Step-by-step guide:</h4>
          
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary flex-shrink-0 mt-0.5">
                <span style={{ fontSize: '0.75rem' }}>1</span>
              </div>
              <div className="flex-1">
                <p style={{ fontSize: '0.875rem' }}>
                  Log in to your Shopify admin panel at <code className="px-1 py-0.5 rounded bg-muted text-foreground">your-store.myshopify.com/admin</code>
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary flex-shrink-0 mt-0.5">
                <span style={{ fontSize: '0.75rem' }}>2</span>
              </div>
              <div className="flex-1">
                <p style={{ fontSize: '0.875rem' }}>
                  Navigate to <strong>Settings → Apps and sales channels → Develop apps</strong>
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary flex-shrink-0 mt-0.5">
                <span style={{ fontSize: '0.75rem' }}>3</span>
              </div>
              <div className="flex-1">
                <p style={{ fontSize: '0.875rem' }}>
                  Click <strong>"Create an app"</strong> and name it "Shopiflow" or similar
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary flex-shrink-0 mt-0.5">
                <span style={{ fontSize: '0.75rem' }}>4</span>
              </div>
              <div className="flex-1">
                <p style={{ fontSize: '0.875rem' }}>
                  Configure <strong>Admin API scopes</strong> with these permissions:
                </p>
                <div className="mt-2 space-y-1">
                  {['read_products', 'write_products', 'read_inventory', 'read_product_listings'].map((scope) => (
                    <div key={scope} className="flex items-center gap-2 ml-4">
                      <CheckCircle className="w-3 h-3 text-green-600" />
                      <code className="text-foreground" style={{ fontSize: '0.75rem' }}>{scope}</code>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary flex-shrink-0 mt-0.5">
                <span style={{ fontSize: '0.75rem' }}>5</span>
              </div>
              <div className="flex-1">
                <p style={{ fontSize: '0.875rem' }}>
                  Install the app and reveal your <strong>API Key</strong>, <strong>API Secret</strong>, and <strong>Access Token</strong>
                </p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <Alert className="bg-primary/5 border-primary/20">
          <Shield className="h-4 w-4 text-primary" />
          <AlertDescription>
            <strong>Security tip:</strong> Never share your API credentials. Shopiflow encrypts and stores them securely in your Framer project.
          </AlertDescription>
        </Alert>

        <div className="pt-2">
          <a 
            href="https://help.shopify.com/en/manual/apps/app-types/custom-apps" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-primary hover:underline" 
            style={{ fontSize: '0.875rem' }}
          >
            View official Shopify documentation
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
