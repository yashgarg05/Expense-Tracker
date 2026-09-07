import type { CategoryType } from '../types/transaction';
import {
  Utensils,
  Car,
  ShoppingBag,
  Film,
  FileText,
  HeartPulse,
  GraduationCap,
  Briefcase,
  Laptop,
  CircleEllipsis,
} from 'lucide-react';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function parseLocalDate(dateString: string): Date | null {
  if (!dateString || typeof dateString !== 'string') return null;
  const parts = dateString.trim().split('-');
  if (parts.length !== 3) return null;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
  const d = new Date(year, month, day);
  if (isNaN(d.getTime())) return null;
  return d;
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = parseLocalDate(dateString);
  if (!date) return dateString;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
}

export function getCategoryIcon(category: CategoryType) {
  switch (category) {
    case 'Food':
      return Utensils;
    case 'Transport':
      return Car;
    case 'Shopping':
      return ShoppingBag;
    case 'Entertainment':
      return Film;
    case 'Bills':
      return FileText;
    case 'Health':
      return HeartPulse;
    case 'Education':
      return GraduationCap;
    case 'Salary':
      return Briefcase;
    case 'Freelance':
      return Laptop;
    default:
      return CircleEllipsis;
  }
}

export const CATEGORY_COLORS: Record<CategoryType, string> = {
  Food: '#f97316', // orange
  Transport: '#3b82f6', // blue
  Shopping: '#ec4899', // pink
  Entertainment: '#8b5cf6', // purple
  Bills: '#eab308', // yellow
  Health: '#10b981', // emerald
  Education: '#06b6d4', // cyan
  Salary: '#22c55e', // green
  Freelance: '#14b8a6', // teal
  Other: '#64748b', // slate
};
