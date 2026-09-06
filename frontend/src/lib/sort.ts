import type { Transaction } from '../types/transaction';

/**
 * Sorts transactions in descending chronological order (newest date -> oldest date).
 * For transactions on the same date, preserves insertion order with the newest-created
 * transaction appearing first.
 *
 * Does NOT mutate the input array.
 */
export function sortTransactions(transactions: Transaction[]): Transaction[] {
  if (!transactions || transactions.length === 0) return [];

  return transactions
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      // 1. Primary sort: Descending date comparison (YYYY-MM-DD)
      const dateDiff = b.item.date.localeCompare(a.item.date);
      if (dateDiff !== 0) {
        return dateDiff;
      }
      // 2. Secondary sort: Higher original index (newer insertion) first for same-date items
      return b.index - a.index;
    })
    .map(({ item }) => item);
}
