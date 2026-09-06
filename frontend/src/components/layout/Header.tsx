import React from 'react';
import { Plus, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  title: string;
  subtitle: string;
  onOpenAddModal: () => void;
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onOpenAddModal,
  onOpenMobileMenu,
}) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 backdrop-blur-xs px-4 md:px-8 py-3 transition-colors">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex flex-col">
          <h1 className="text-lg font-semibold tracking-tight text-foreground">
            {title}
          </h1>
          <p className="text-xs text-muted-foreground hidden sm:block">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          onClick={onOpenAddModal}
          size="sm"
          className="flex items-center gap-1.5 font-medium shadow-xs"
        >
          <Plus className="h-4 w-4" />
          <span>Add Transaction</span>
        </Button>
      </div>
    </header>
  );
};
