import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Monitor, Download, Upload, Trash2, AlertTriangle, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SettingsProps {
  onClearAll: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ onClearAll }) => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [displayName, setDisplayName] = useState('Yash Garg');
  const [email, setEmail] = useState('yash@example.com');
  const [currency, setCurrency] = useState('INR');
  const [dateFormat, setDateFormat] = useState('MMM DD, YYYY');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    const root = document.documentElement;
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else if (newTheme === 'light') {
      root.classList.remove('dark');
    } else {
      // System default preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="max-w-4xl space-y-8 select-none">
      {/* Profile Section */}
      <div className="rounded-xl border border-border/80 bg-card p-6 shadow-2xs space-y-4">
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-foreground">
            User Profile
          </h3>
          <p className="text-xs text-muted-foreground/80">
            Manage your personal account details
          </p>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs border border-primary/20 shadow-2xs">
              YG
            </div>
            <div>
              <Button type="button" variant="outline" size="xs">
                Change Avatar
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-medium text-foreground">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full h-9 rounded-lg border border-input bg-background px-3 text-xs text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-colors"
              />
            </div>
            <div className="space-y-1">
              <label className="font-medium text-foreground">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-9 rounded-lg border border-input bg-background px-3 text-xs text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Button type="submit" size="xs" className="gap-1">
              {savedSuccess ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" /> Saved
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Preferences & Appearance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Appearance */}
        <div className="rounded-xl border border-border/80 bg-card p-6 shadow-2xs space-y-4">
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-foreground">
              Appearance
            </h3>
            <p className="text-xs text-muted-foreground/80">
              Choose your preferred interface theme
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              onClick={() => handleThemeChange('light')}
              className={cn(
                'flex flex-col items-center justify-center gap-2 p-3 rounded-xl border text-center transition-all cursor-pointer active:scale-[0.98]',
                theme === 'light'
                  ? 'border-primary bg-primary/5 text-primary font-semibold shadow-2xs'
                  : 'border-border/80 bg-card text-muted-foreground hover:text-foreground hover:border-border'
              )}
            >
              <Sun className="h-4.5 w-4.5" />
              <span>Light</span>
            </button>

            <button
              onClick={() => handleThemeChange('dark')}
              className={cn(
                'flex flex-col items-center justify-center gap-2 p-3 rounded-xl border text-center transition-all cursor-pointer active:scale-[0.98]',
                theme === 'dark'
                  ? 'border-primary bg-primary/5 text-primary font-semibold shadow-2xs'
                  : 'border-border/80 bg-card text-muted-foreground hover:text-foreground hover:border-border'
              )}
            >
              <Moon className="h-4.5 w-4.5" />
              <span>Dark</span>
            </button>

            <button
              onClick={() => handleThemeChange('system')}
              className={cn(
                'flex flex-col items-center justify-center gap-2 p-3 rounded-xl border text-center transition-all cursor-pointer active:scale-[0.98]',
                theme === 'system'
                  ? 'border-primary bg-primary/5 text-primary font-semibold shadow-2xs'
                  : 'border-border/80 bg-card text-muted-foreground hover:text-foreground hover:border-border'
              )}
            >
              <Monitor className="h-4.5 w-4.5" />
              <span>System</span>
            </button>
          </div>
        </div>

        {/* Regional Preferences */}
        <div className="rounded-xl border border-border/80 bg-card p-6 shadow-2xs space-y-4">
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-foreground">
              Preferences
            </h3>
            <p className="text-xs text-muted-foreground/80">
              Currency and regional formatting
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="font-medium text-foreground">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full h-9 rounded-lg border border-input bg-background px-3 text-xs text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-colors cursor-pointer"
              >
                <option value="INR">INR (₹) - Indian Rupee</option>
                <option value="USD">USD ($) - US Dollar</option>
                <option value="EUR">EUR (€) - Euro</option>
                <option value="GBP">GBP (£) - British Pound</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-medium text-foreground">Date Format</label>
              <select
                value={dateFormat}
                onChange={(e) => setDateFormat(e.target.value)}
                className="w-full h-9 rounded-lg border border-input bg-background px-3 text-xs text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-colors cursor-pointer"
              >
                <option value="MMM DD, YYYY">MMM DD, YYYY (e.g. Sep 05, 2026)</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 05/09/2026)</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD (e.g. 2026-09-05)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="rounded-xl border border-border/80 bg-card p-6 shadow-2xs space-y-4">
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-foreground">
            Data Management
          </h3>
          <p className="text-xs text-muted-foreground/80">
            Export or import transaction backups
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="outline" size="sm" className="flex items-center gap-1.5">
            <Download className="h-3.5 w-3.5" />
            <span>Export Data (JSON)</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1.5">
            <Upload className="h-3.5 w-3.5" />
            <span>Import Data</span>
          </Button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-6 shadow-2xs space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-rose-600 dark:text-rose-400 tracking-tight">
            Danger Zone
          </h3>
          <p className="text-xs text-muted-foreground/80">
            Actions here affect local state data permanently
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-foreground">
              Clear all transactions
            </span>
            <p className="text-[11px] text-muted-foreground/80">
              Removes all transaction records from current local state.
            </p>
          </div>
          <Button
            variant="destructive"
            size="sm"
            className="flex items-center gap-1.5 shrink-0"
            onClick={() => setShowClearConfirm(true)}
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear All Data</span>
          </Button>
        </div>
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setShowClearConfirm(false)}
          />
          <div className="relative z-50 w-full max-w-sm rounded-2xl border border-border/80 bg-card p-6 shadow-2xl space-y-5 text-foreground select-none animate-in fade-in zoom-in-95 duration-150">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-foreground tracking-tight">
                Clear all transactions?
              </h3>
              <p className="text-xs text-muted-foreground/80">
                This will reset your local transaction state. Are you sure?
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowClearConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  onClearAll();
                  setShowClearConfirm(false);
                }}
              >
                Confirm Clear
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
