export interface Transaction {
  walletId: string;
  txid: string;
  amount: number;
  fee: number;
  direction: 'IN' | 'OUT';
  fromAddress: string | null;
  toAddress: string | null;
  status: 'CONFIRMED' | 'PENDING';
  createdAt: string;
  confirmedAt: string | null;
}
