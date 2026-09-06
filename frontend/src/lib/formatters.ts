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

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
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
