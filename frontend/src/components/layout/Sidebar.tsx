import type { ActivePage } from '../../types/transaction';
import {
  LayoutDashboard,
  Receipt,
  PieChart,
  Settings,
  Wallet,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  setActivePage,
  mobileOpen,
  setMobileOpen,
}) => {
  const navItems = [
    { id: 'overview' as ActivePage, label: 'Overview', icon: LayoutDashboard },
    { id: 'transactions' as ActivePage, label: 'Transactions', icon: Receipt },
    { id: 'analytics' as ActivePage, label: 'Analytics', icon: PieChart },
  ];

  const handleNavClick = (page: ActivePage) => {
    setActivePage(page);
    setMobileOpen(false);
  };

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between p-4 bg-sidebar text-sidebar-foreground border-r border-sidebar-border select-none">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2 pt-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Wallet className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm tracking-tight text-foreground">
                Expense Tracker
              </span>
              <span className="text-[11px] font-medium text-muted-foreground">
                Desktop Edition
              </span>
            </div>
          </div>
          {/* Mobile Close Button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Section */}
        <nav className="space-y-1">
          <div className="px-2 pb-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
            Main Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold shadow-xs'
                    : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground'
                )}
              >
                <Icon
                  className={cn(
                    'h-4 w-4 shrink-0 transition-colors',
                    isActive ? 'text-foreground' : 'text-muted-foreground'
                  )}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Divider & System Section */}
        <div className="pt-2">
          <div className="h-px bg-sidebar-border mx-2 mb-3" />
          <div className="px-2 pb-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
            System
          </div>
          <button
            onClick={() => handleNavClick('settings')}
            aria-current={activePage === 'settings' ? 'page' : undefined}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-ring',
              activePage === 'settings'
                ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold shadow-xs'
                : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground'
            )}
          >
            <Settings
              className={cn(
                'h-4 w-4 shrink-0 transition-colors',
                activePage === 'settings'
                  ? 'text-foreground'
                  : 'text-muted-foreground'
              )}
            />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* User Profile Footer */}
      <div className="pt-4 border-t border-sidebar-border mt-auto">
        <div className="flex items-center gap-3 rounded-xl p-2 hover:bg-sidebar-accent/50 transition-colors cursor-pointer">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs border border-primary/20">
            YG
          </div>
          <div className="flex flex-col truncate">
            <span className="text-xs font-semibold text-foreground truncate">
              Yash Garg
            </span>
            <span className="text-[11px] text-muted-foreground truncate">
              Personal Account
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile Backdrop & Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative z-50 w-72 h-full bg-sidebar shadow-xl flex flex-col">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};
