import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import type { ActivePage } from '../../types/transaction';

interface AppShellProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  onOpenAddModal: () => void;
  children: React.ReactNode;
}

const PAGE_META: Record<ActivePage, { title: string; subtitle: string }> = {
  overview: {
    title: 'Overview',
    subtitle: 'Track your income, expenses and spending habits.',
  },
  transactions: {
    title: 'Transactions',
    subtitle: 'View and manage all your transactions.',
  },
  analytics: {
    title: 'Analytics',
    subtitle: 'Understand where your money is going.',
  },
  settings: {
    title: 'Settings',
    subtitle: 'Manage app preferences and profile.',
  },
};

export const AppShell: React.FC<AppShellProps> = ({
  activePage,
  setActivePage,
  onOpenAddModal,
  children,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const { title, subtitle } = PAGE_META[activePage];

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Column */}
      <div className="flex flex-1 flex-col h-full overflow-hidden">
        <Header
          title={title}
          subtitle={subtitle}
          onOpenAddModal={onOpenAddModal}
          onOpenMobileMenu={() => setMobileOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8">
          <div className="mx-auto max-w-7xl space-y-8">{children}</div>
        </main>
      </div>
    </div>
  );
};
