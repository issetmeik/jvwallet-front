import { ApiResponse } from './api-response.interface';
import { Transaction } from './transaction-interface';

export interface Wallet {
  id: string;
  userId: string;
  address: string;
  balance: string;
  createdAt: string;
  name?: string;
  transactions: Transaction[];
}

export interface Tx {
  txId: string;
}

export interface Sync {
  message: string;
}

export type SyncResponse = ApiResponse<Sync>;
export type TxResponse = ApiResponse<Tx>;
export type WalletsResponse = ApiResponse<Wallet[]>;
export type WalletResponse = ApiResponse<Wallet>;
