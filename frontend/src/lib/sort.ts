import type { Transaction } from '../types/transaction';

export type SortMode = 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc';

/**
 * Sorts transactions based on the selected SortMode.
 * Default is 'date-desc' (newest date first, newest insertion first for same date).
 * Does NOT mutate the input array.
 */
export function sortTransactions(
  transactions: Transaction[],
  mode: SortMode = 'date-desc'
): Transaction[] {
  if (!transactions || transactions.length === 0) return [];

  return transactions
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      switch (mode) {
        case 'date-asc': {
          const dateDiff = a.item.date.localeCompare(b.item.date);
          if (dateDiff !== 0) return dateDiff;
          return a.index - b.index;
        }
        case 'amount-desc': {
          const amtDiff = b.item.amount - a.item.amount;
          if (amtDiff !== 0) return amtDiff;
          return b.item.date.localeCompare(a.item.date);
        }
        case 'amount-asc': {
          const amtDiff = a.item.amount - b.item.amount;
          if (amtDiff !== 0) return amtDiff;
          return b.item.date.localeCompare(a.item.date);
        }
        case 'date-desc':
        default: {
          const dateDiff = b.item.date.localeCompare(a.item.date);
          if (dateDiff !== 0) return dateDiff;
          return b.index - a.index;
        }
      }
    })
    .map(({ item }) => item);
}
