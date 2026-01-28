import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Users,
  FileText,
  BarChart3,
  Settings,
  TrendingUp,
  ShoppingCart,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Billing', href: '/billing', icon: ShoppingCart },
  { name: 'Invoices', href: '/invoices', icon: FileText },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Stock Movement', href: '/stock', icon: TrendingUp },
  { name: 'Settings', href: '/settings', icon: Settings },
];

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps = {}) {
  const location = useLocation();

  return (
    <div className="lg:fixed lg:inset-y-0 lg:z-50 flex lg:w-72 flex-col h-full">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-white/10 bg-gradient-to-b from-[#1a1625] to-[#0f0a1a] px-6 pb-4">
        <div className="flex h-20 shrink-0 items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Package className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">InvenTrack</h1>
            <p className="text-xs text-muted-foreground">Smart Business Suite</p>
          </div>
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        onClick={() => onNavigate?.()}
                        className={cn(
                          'group flex gap-x-3 rounded-lg p-3 text-sm font-semibold leading-6 transition-all duration-200',
                          isActive
                            ? 'bg-gradient-primary text-white shadow-lg shadow-primary/50'
                            : 'text-gray-400 hover:text-white hover:bg-white/10'
                        )}
                      >
                        <item.icon
                          className={cn(
                            'h-5 w-5 shrink-0 transition-transform duration-200',
                            isActive ? 'scale-110' : 'group-hover:scale-110'
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
