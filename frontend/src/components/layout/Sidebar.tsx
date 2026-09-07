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
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs border border-primary/20 shrink-0">
              <Wallet className="h-4.5 w-4.5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-sm tracking-tight text-foreground truncate">
                Expense Tracker
              </span>
              <span className="text-[11px] font-medium text-muted-foreground/80 truncate">
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
          <div className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
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
                  'relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.99]',
                  isActive
                    ? 'bg-sidebar-accent text-foreground font-semibold shadow-2xs'
                    : 'text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground'
                )}
              >
                {isActive && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-primary" />
                )}
                <Icon
                  className={cn(
                    'h-4 w-4 shrink-0 transition-colors',
                    isActive ? 'text-primary' : 'text-muted-foreground/80'
                  )}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Divider & System Section */}
        <div className="pt-2 space-y-1">
          <div className="h-px bg-sidebar-border/80 mx-2 mb-3" />
          <div className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
            System
          </div>
          <button
            onClick={() => handleNavClick('settings')}
            aria-current={activePage === 'settings' ? 'page' : undefined}
            className={cn(
              'relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.99]',
              activePage === 'settings'
                ? 'bg-sidebar-accent text-foreground font-semibold shadow-2xs'
                : 'text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground'
            )}
          >
            {activePage === 'settings' && (
              <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-primary" />
            )}
            <Settings
              className={cn(
                'h-4 w-4 shrink-0 transition-colors',
                activePage === 'settings'
                  ? 'text-primary'
                  : 'text-muted-foreground/80'
              )}
            />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* User Profile Footer */}
      <div className="pt-3 border-t border-sidebar-border/80 mt-auto">
        <div className="flex items-center gap-3 rounded-xl p-2 hover:bg-sidebar-accent/60 transition-all cursor-pointer group">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs border border-primary/20 shadow-2xs group-hover:border-primary/30 transition-colors">
            YG
          </div>
          <div className="flex flex-col truncate min-w-0">
            <span className="text-xs font-semibold text-foreground truncate">
              Yash Garg
            </span>
            <span className="text-[11px] text-muted-foreground/80 truncate">
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
