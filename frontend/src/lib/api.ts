import { invoke } from '@tauri-apps/api/core';
import type { Transaction, DashboardSummary } from '../types/transaction';

/**
 * Fetch all transactions from the Python backend via Tauri IPC.
 */
export async function getTransactions(): Promise<Transaction[]> {
  return await invoke<Transaction[]>('get_transactions');
}

/**
 * Add a new transaction through Python backend.
 */
export async function addTransaction(
  data: Omit<Transaction, 'id'> & { id?: string }
): Promise<Transaction> {
  return await invoke<Transaction>('add_transaction', { transaction: data });
}

/**
 * Update an existing transaction through Python backend.
 */
export async function updateTransaction(
  transaction: Transaction
): Promise<Transaction> {
  return await invoke<Transaction>('update_transaction', { transaction });
}

/**
 * Delete a transaction by ID through Python backend.
 */
export async function deleteTransaction(id: string): Promise<boolean> {
  return await invoke<boolean>('delete_transaction', { id });
}

/**
 * Clear all transactions through Python backend.
 */
export async function clearTransactions(): Promise<boolean> {
  return await invoke<boolean>('clear_transactions');
}

/**
 * Fetch summary stats from Python backend.
 */
export async function getSummary(): Promise<DashboardSummary> {
  return await invoke<DashboardSummary>('get_summary');
}
