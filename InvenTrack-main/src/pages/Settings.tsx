import { useState } from 'react';
import { Settings as SettingsIcon, Building2, Percent, User, Bell, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Settings() {
  const { toast } = useToast();
  const [businessSettings, setBusinessSettings] = useState({
    name: 'My Business',
    email: 'business@example.com',
    phone: '+91 98765 43210',
    address: '123 Business Street, City',
    gstin: '29ABCDE1234F1Z5',
  });

  const [notifications, setNotifications] = useState({
    lowStock: true,
    newInvoice: true,
    emailReports: false,
  });

  const handleSaveBusinessSettings = () => {
    toast({
      title: 'Settings Saved',
      description: 'Business settings updated successfully',
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: 'Settings Saved',
      description: 'Notification preferences updated successfully',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center">
          <SettingsIcon className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Configure your system preferences</p>
        </div>
      </div>

      <Tabs defaultValue="business" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="business">
            <Building2 className="h-4 w-4 mr-2" />
            Business
          </TabsTrigger>
          <TabsTrigger value="tax">
            <Percent className="h-4 w-4 mr-2" />
            Tax
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Alerts
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="business" className="space-y-6">
          <div className="glass-card p-6 rounded-lg space-y-4">
            <h2 className="text-xl font-semibold">Business Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  value={businessSettings.name}
                  onChange={(e) =>
                    setBusinessSettings({ ...businessSettings, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="businessEmail">Email</Label>
                <Input
                  id="businessEmail"
                  type="email"
                  value={businessSettings.email}
                  onChange={(e) =>
                    setBusinessSettings({ ...businessSettings, email: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="businessPhone">Phone</Label>
                <Input
                  id="businessPhone"
                  value={businessSettings.phone}
                  onChange={(e) =>
                    setBusinessSettings({ ...businessSettings, phone: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="businessGSTIN">GSTIN</Label>
                <Input
                  id="businessGSTIN"
                  value={businessSettings.gstin}
                  onChange={(e) =>
                    setBusinessSettings({ ...businessSettings, gstin: e.target.value })
                  }
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="businessAddress">Address</Label>
                <Textarea
                  id="businessAddress"
                  value={businessSettings.address}
                  onChange={(e) =>
                    setBusinessSettings({ ...businessSettings, address: e.target.value })
                  }
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSaveBusinessSettings} className="bg-gradient-primary">
                Save Changes
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tax" className="space-y-6">
          <div className="glass-card p-6 rounded-lg space-y-4">
            <h2 className="text-xl font-semibold">Tax Configuration</h2>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <h3 className="font-semibold mb-2">GST Rates</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Default GST rates available in the system
                </p>
                <div className="grid grid-cols-4 gap-3">
                  {['5%', '12%', '18%', '28%'].map((rate) => (
                    <div
                      key={rate}
                      className="p-3 rounded-lg bg-white/5 border border-white/10 text-center"
                    >
                      <p className="text-2xl font-bold text-primary">{rate}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <h3 className="font-semibold mb-2">Tax Calculation Mode</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Intra-State (CGST + SGST)</p>
                      <p className="text-sm text-muted-foreground">
                        For transactions within the same state
                      </p>
                    </div>
                    <div className="px-3 py-1 rounded-md bg-green-500/20 text-green-500 text-sm">
                      Active
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Inter-State (IGST)</p>
                      <p className="text-sm text-muted-foreground">
                        For transactions across different states
                      </p>
                    </div>
                    <div className="px-3 py-1 rounded-md bg-green-500/20 text-green-500 text-sm">
                      Active
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <div className="glass-card p-6 rounded-lg space-y-4">
            <h2 className="text-xl font-semibold">Notification Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                <div>
                  <p className="font-medium">Low Stock Alerts</p>
                  <p className="text-sm text-muted-foreground">
                    Get notified when product stock is low
                  </p>
                </div>
                <Switch
                  checked={notifications.lowStock}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, lowStock: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                <div>
                  <p className="font-medium">New Invoice Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Get notified when a new invoice is created
                  </p>
                </div>
                <Switch
                  checked={notifications.newInvoice}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, newInvoice: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                <div>
                  <p className="font-medium">Email Reports</p>
                  <p className="text-sm text-muted-foreground">
                    Receive daily/weekly sales reports via email
                  </p>
                </div>
                <Switch
                  checked={notifications.emailReports}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, emailReports: checked })
                  }
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSaveNotifications} className="bg-gradient-primary">
                Save Preferences
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="glass-card p-6 rounded-lg space-y-4">
            <h2 className="text-xl font-semibold">Security Settings</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" placeholder="Enter current password" />
              </div>
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" placeholder="Enter new password" />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" placeholder="Confirm new password" />
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                onClick={() =>
                  toast({
                    title: 'Password Updated',
                    description: 'Your password has been changed successfully',
                  })
                }
                className="bg-gradient-primary"
              >
                Update Password
              </Button>
            </div>
          </div>

          <div className="glass-card p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Active Sessions</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                <div>
                  <p className="font-medium">Current Session</p>
                  <p className="text-sm text-muted-foreground">Chrome on Windows • Active now</p>
                </div>
                <div className="px-3 py-1 rounded-md bg-green-500/20 text-green-500 text-sm">
                  Active
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
