import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Eye, EyeOff, ShoppingBag, AlertCircle, CheckCircle2 } from 'lucide-react';
import { normalizeStoreDomain, verifyCredentials } from "../lib/shopify";
import type { ShopifyCredentials, ShopifyStoreInfo } from "../lib/types";

interface ShopifyAuthCardProps {
  initialCredentials?: ShopifyCredentials;
  onConnect: (payload: ShopifyCredentials & { shop?: ShopifyStoreInfo }) => void;
  onShowApiHelp: () => void;
}

export function ShopifyAuthCard({ initialCredentials, onConnect, onShowApiHelp }: ShopifyAuthCardProps) {
  const [storeDomain, setStoreDomain] = useState(initialCredentials?.storeDomain ?? '');
  const [apiKey, setApiKey] = useState(initialCredentials?.apiKey ?? '');
  const [apiSecret, setApiSecret] = useState(initialCredentials?.apiSecret ?? '');
  const [accessToken, setAccessToken] = useState(initialCredentials?.accessToken ?? '');
  const [showApiKey, setShowApiKey] = useState(false);
  const [showApiSecret, setShowApiSecret] = useState(false);
  const [showAccessToken, setShowAccessToken] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialCredentials) {
      setStoreDomain(initialCredentials.storeDomain ?? '');
      setApiKey(initialCredentials.apiKey ?? '');
      setApiSecret(initialCredentials.apiSecret ?? '');
      setAccessToken(initialCredentials.accessToken ?? '');
    }
  }, [initialCredentials]);

  const handleConnect = async () => {
    setError('');
    
    // Validation
    if (!storeDomain || !accessToken) {
      setError('Please fill in store name and access token to continue');
      return;
    }

    if (!storeDomain.includes('.myshopify.com') && !storeDomain.includes('.')) {
      setError('Store name must be in format: your-store.myshopify.com');
      return;
    }

    if (!accessToken.startsWith('shpat_') && accessToken.length < 20) {
      setError('Access token appears to be invalid. It should start with "shpat_"');
      return;
    }

    setIsValidating(true);
    
    try {
      // Clean up store name
      const normalizedDomain = normalizeStoreDomain(storeDomain);
      const shop = await verifyCredentials({ storeDomain: normalizedDomain, accessToken });

      setIsValidating(false);
      onConnect({ storeDomain: normalizedDomain, apiKey, apiSecret, accessToken, shop });
    } catch (err) {
      setIsValidating(false);
      if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
        setError('Unable to connect to Shopify. CORS is blocking the request. Please deploy this app to Vercel for full functionality, or enable CORS in your Shopify app settings.');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to connect to Shopify. Please check your credentials.');
      }
    }
  };

  return (
    <Card className="border-border/50">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/5 rounded-lg">
            <ShoppingBag className="w-5 h-5 text-primary" />
          </div>
          <CardTitle>Connect Shopify Store</CardTitle>
        </div>
        <CardDescription>
          Enter your Shopify API credentials to connect your store
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="storeName">Store Domain *</Label>
          <Input
            id="storeName"
            placeholder="your-store.myshopify.com"
            value={storeDomain}
            onChange={(e) => setStoreDomain(e.target.value)}
            className="bg-input-background"
          />
          <p className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>
            Your Shopify store URL
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="apiKey">API Key *</Label>
          <div className="relative">
            <Input
              id="apiKey"
              type={showApiKey ? 'text' : 'password'}
              placeholder="Enter your API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="bg-input-background pr-10"
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="apiSecret">API Secret Key *</Label>
          <div className="relative">
            <Input
              id="apiSecret"
              type={showApiSecret ? 'text' : 'password'}
              placeholder="Enter your API secret"
              value={apiSecret}
              onChange={(e) => setApiSecret(e.target.value)}
              className="bg-input-background pr-10"
            />
            <button
              type="button"
              onClick={() => setShowApiSecret(!showApiSecret)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showApiSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="accessToken">Admin API Access Token *</Label>
          <div className="relative">
            <Input
              id="accessToken"
              type={showAccessToken ? 'text' : 'password'}
              placeholder="shpat_xxxxxxxxxxxxx"
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              className="bg-input-background pr-10"
            />
            <button
              type="button"
              onClick={() => setShowAccessToken(!showAccessToken)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showAccessToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <Alert className="bg-muted/30 border-border/50">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>
            Your credentials are encrypted and stored securely. Shopiflow never shares your data.
          </AlertDescription>
        </Alert>

        <Button 
          onClick={handleConnect} 
          className="w-full"
          disabled={isValidating}
        >
          {isValidating ? 'Validating...' : 'Connect Store'}
        </Button>

        <div className="pt-2 border-t border-border/50">
          <p className="text-muted-foreground text-center" style={{ fontSize: '0.75rem' }}>
            Need help getting started? {' '}
            {onShowApiHelp ? (
              <button 
                onClick={onShowApiHelp}
                className="text-primary hover:underline cursor-pointer"
              >
                View our setup guide
              </button>
            ) : (
              <a href="#" className="text-primary hover:underline">View our setup guide</a>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
