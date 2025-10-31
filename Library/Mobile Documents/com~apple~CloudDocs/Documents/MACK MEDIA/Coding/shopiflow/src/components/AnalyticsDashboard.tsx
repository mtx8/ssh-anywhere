import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { 
  ArrowLeft,
  TrendingUp,
  Package,
  Clock,
  Zap,
  Calendar,
  BarChart3,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface AnalyticsDashboardProps {
  onBack: () => void;
}

export function AnalyticsDashboard({ onBack }: AnalyticsDashboardProps) {
  const stats = [
    { label: 'Total Products', value: '8', change: '+2', trend: 'up', icon: Package },
    { label: 'Total Syncs', value: '24', change: '+3', trend: 'up', icon: Zap },
    { label: 'Avg Sync Time', value: '2.1s', change: '-0.3s', trend: 'down', icon: Clock },
    { label: 'Success Rate', value: '98%', change: '+2%', trend: 'up', icon: TrendingUp },
  ];

  const recentActivity = [
    { action: 'Product synced', item: 'Classic White T-Shirt', time: '2 min ago' },
    { action: 'Product updated', item: 'Premium Denim Jeans', time: '1 hour ago' },
    { action: 'Product synced', item: 'Leather Messenger Bag', time: '3 hours ago' },
    { action: 'Settings updated', item: 'Auto-sync enabled', time: '5 hours ago' },
    { action: 'Product synced', item: 'Minimalist Watch', time: '1 day ago' },
  ];

  const topProducts = [
    { name: 'Classic White T-Shirt', syncs: 12, status: 'active' },
    { name: 'Premium Denim Jeans', syncs: 10, status: 'active' },
    { name: 'Wireless Headphones', syncs: 8, status: 'active' },
    { name: 'Running Sneakers', syncs: 7, status: 'active' },
    { name: 'Canvas Backpack', syncs: 6, status: 'active' },
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
        {/* Header */}
        <div>
          <h2>Analytics Dashboard</h2>
          <p className="text-muted-foreground">Monitor your sync performance and activity</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    <div className="flex items-center gap-1">
                      {stat.trend === 'up' ? (
                        <ArrowUpRight className="w-3 h-3 text-green-600" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3 text-green-600" />
                      )}
                      <span className="text-green-600" style={{ fontSize: '0.75rem' }}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className="mb-1">{stat.value}</div>
                  <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
                    {stat.label}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Sync Performance */}
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                <CardTitle>Sync Performance</CardTitle>
              </div>
              <CardDescription>Last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
                  const value = Math.floor(Math.random() * 60) + 40;
                  return (
                    <div key={day} className="space-y-1">
                      <div className="flex items-center justify-between" style={{ fontSize: '0.875rem' }}>
                        <span className="text-muted-foreground">{day}</span>
                        <span>{value}s</span>
                      </div>
                      <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Product Distribution */}
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                <CardTitle>Top Synced Products</CardTitle>
              </div>
              <CardDescription>Most frequently synced</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[240px]">
                <div className="space-y-3">
                  {topProducts.map((product, i) => (
                    <div key={product.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-6 h-6 rounded bg-primary/10 text-primary" style={{ fontSize: '0.75rem' }}>
                          {i + 1}
                        </div>
                        <div>
                          <p style={{ fontSize: '0.875rem' }}>{product.name}</p>
                          <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
                            {product.syncs} syncs
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" style={{ fontSize: '0.65rem' }}>
                        {product.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              <CardTitle>Recent Activity</CardTitle>
            </div>
            <CardDescription>Latest sync events and changes</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[280px]">
              <div className="space-y-2">
                {recentActivity.map((activity, i) => (
                  <div key={i}>
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/20 transition-colors">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                      <div className="flex-1">
                        <p style={{ fontSize: '0.875rem' }}>
                          <span className="text-foreground">{activity.action}</span>
                          {' • '}
                          <span className="text-muted-foreground">{activity.item}</span>
                        </p>
                        <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
                          {activity.time}
                        </p>
                      </div>
                    </div>
                    {i < recentActivity.length - 1 && <Separator className="my-2" />}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Time Period Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Calendar className="w-4 h-4" />
                <span style={{ fontSize: '0.75rem' }}>Today</span>
              </div>
              <div className="mb-1">3 syncs</div>
              <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
                8 products updated
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Calendar className="w-4 h-4" />
                <span style={{ fontSize: '0.75rem' }}>This Week</span>
              </div>
              <div className="mb-1">18 syncs</div>
              <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
                42 products updated
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Calendar className="w-4 h-4" />
                <span style={{ fontSize: '0.75rem' }}>This Month</span>
              </div>
              <div className="mb-1">67 syncs</div>
              <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
                156 products updated
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
