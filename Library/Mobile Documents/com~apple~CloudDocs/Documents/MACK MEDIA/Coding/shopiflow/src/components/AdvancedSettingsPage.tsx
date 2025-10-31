import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { ScrollArea } from './ui/scroll-area';
import { 
  ArrowLeft, 
  Settings2,
  Webhook,
  Bell,
  AlertCircle,
  CheckCircle2,
  Clock,
  Trash2
} from 'lucide-react';

interface AdvancedSettingsPageProps {
  onBack: () => void;
}

export function AdvancedSettingsPage({ onBack }: AdvancedSettingsPageProps) {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [enableWebhooks, setEnableWebhooks] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [syncNotifications, setSyncNotifications] = useState(true);
  const [errorNotifications, setErrorNotifications] = useState(true);
  const [logRetention, setLogRetention] = useState('30');

  const syncHistory = [
    { id: 1, date: 'Oct 12, 2025 10:30 AM', products: 8, status: 'success', duration: '2.3s' },
    { id: 2, date: 'Oct 12, 2025 9:15 AM', products: 8, status: 'success', duration: '1.8s' },
    { id: 3, date: 'Oct 11, 2025 4:20 PM', products: 6, status: 'success', duration: '2.1s' },
    { id: 4, date: 'Oct 11, 2025 2:45 PM', products: 8, status: 'success', duration: '2.5s' },
    { id: 5, date: 'Oct 10, 2025 11:30 AM', products: 5, status: 'partial', duration: '3.2s' },
  ];

  return (
    <div className="animate-in fade-in duration-300">
      <Button
        variant="outline"
        onClick={onBack}
        className="mb-6 gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Plugin
      </Button>

      <div className="space-y-6">
        {/* Webhooks */}
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/5 rounded-lg">
                <Webhook className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle>Webhooks</CardTitle>
                <CardDescription>Receive real-time updates when products sync</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20">
              <div>
                <Label>Enable Webhooks</Label>
                <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
                  Send POST requests on sync events
                </p>
              </div>
              <Switch
                checked={enableWebhooks}
                onCheckedChange={setEnableWebhooks}
              />
            </div>

            {enableWebhooks && (
              <div className="space-y-2 animate-in fade-in duration-300">
                <Label htmlFor="webhookUrl">Webhook URL</Label>
                <Input
                  id="webhookUrl"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://your-app.com/api/webhook"
                  className="bg-input-background"
                />
                <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
                  Shopiflow will send a POST request to this URL after each sync
                </p>
              </div>
            )}

            <Alert className="bg-muted/30 border-border/50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription style={{ fontSize: '0.875rem' }}>
                Webhook payloads include sync status, product count, and timestamp
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/5 rounded-lg">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Configure how you receive updates</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
              <div>
                <Label>Email Notifications</Label>
                <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
                  Receive email summaries of sync activity
                </p>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
              <div>
                <Label>Sync Completion</Label>
                <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
                  Notify when syncs complete successfully
                </p>
              </div>
              <Switch
                checked={syncNotifications}
                onCheckedChange={setSyncNotifications}
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
              <div>
                <Label>Error Alerts</Label>
                <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
                  Alert me when syncs fail
                </p>
              </div>
              <Switch
                checked={errorNotifications}
                onCheckedChange={setErrorNotifications}
              />
            </div>
          </CardContent>
        </Card>

        {/* Sync History */}
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/5 rounded-lg">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Sync History</CardTitle>
                  <CardDescription>Recent synchronization activity</CardDescription>
                </div>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Trash2 className="w-3 h-3" />
                Clear History
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {syncHistory.map((sync, index) => (
                  <div key={sync.id}>
                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/20 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          sync.status === 'success' 
                            ? 'bg-green-500/10' 
                            : 'bg-yellow-500/10'
                        }`}>
                          {sync.status === 'success' ? (
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-yellow-600" />
                          )}
                        </div>
                        <div>
                          <p style={{ fontSize: '0.875rem' }}>{sync.date}</p>
                          <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
                            {sync.products} products • {sync.duration}
                          </p>
                        </div>
                      </div>
                      <Badge variant={sync.status === 'success' ? 'secondary' : 'outline'}>
                        {sync.status === 'success' ? 'Success' : 'Partial'}
                      </Badge>
                    </div>
                    {index < syncHistory.length - 1 && <Separator className="my-2" />}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Advanced Options */}
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/5 rounded-lg">
                <Settings2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle>Advanced Options</CardTitle>
                <CardDescription>Fine-tune your sync configuration</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="logRetention">Log Retention (days)</Label>
              <Input
                id="logRetention"
                type="number"
                value={logRetention}
                onChange={(e) => setLogRetention(e.target.value)}
                className="bg-input-background"
              />
              <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
                How long to keep sync logs before automatic deletion
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4>Danger Zone</h4>
              <div className="p-4 border border-destructive/50 rounded-lg space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p style={{ fontSize: '0.875rem' }}>Clear All Synced Products</p>
                    <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
                      Remove all products from your CMS collection
                    </p>
                  </div>
                  <Button variant="destructive" size="sm">
                    Clear All
                  </Button>
                </div>
                <Separator />
                <div className="flex items-start justify-between">
                  <div>
                    <p style={{ fontSize: '0.875rem' }}>Reset All Settings</p>
                    <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
                      Restore plugin to default configuration
                    </p>
                  </div>
                  <Button variant="destructive" size="sm">
                    Reset
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={onBack}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
