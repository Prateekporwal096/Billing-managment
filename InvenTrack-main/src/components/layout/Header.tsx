import { useState } from 'react';
import { Bell, LogOut, Menu, User, Settings, CreditCard, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
  };

  const mockNotifications = [
    { id: 1, title: 'Low Stock Alert', message: 'LED Monitor 24" is running low (3 units)', time: '5 min ago', unread: true },
    { id: 2, title: 'New Invoice', message: 'Invoice #INV260100001 created successfully', time: '1 hour ago', unread: true },
    { id: 3, title: 'Low Stock Alert', message: 'Office Chair stock below minimum level', time: '2 hours ago', unread: false },
  ];

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-white/10 bg-background/80 backdrop-blur-lg px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <Button 
        variant="ghost" 
        size="icon"
        className="-m-2.5 p-2.5 text-gray-400 lg:hidden hover:text-foreground"
        onClick={onMenuClick}
      >
        <Menu className="h-6 w-6" />
      </Button>

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1 items-center">
          <h2 className="text-lg font-semibold text-foreground">
            Welcome back, {user?.name}!
          </h2>
        </div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative hover:bg-white/10"
            onClick={() => setShowNotifications(true)}
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
          </Button>

          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-white/10" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="hidden lg:block text-sm font-medium">
                  {user?.name}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => {
                navigate('/settings');
                toast({ title: 'Profile', description: 'Profile page coming soon!' });
              }}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Notifications Panel */}
      <Sheet open={showNotifications} onOpenChange={setShowNotifications}>
        <SheetContent className="w-full sm:w-[400px] bg-background/95 backdrop-blur-lg border-white/20">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Notifications
            </SheetTitle>
            <SheetDescription>
              You have {mockNotifications.filter(n => n.unread).length} unread notifications
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            {mockNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border transition-all hover:border-primary/50 cursor-pointer ${
                  notification.unread
                    ? 'bg-primary/10 border-primary/30'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{notification.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                  </div>
                  {notification.unread && (
                    <div className="h-2 w-2 rounded-full bg-primary mt-1"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                toast({ title: 'Notifications', description: 'All notifications marked as read' });
                setShowNotifications(false);
              }}
            >
              Mark all as read
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
