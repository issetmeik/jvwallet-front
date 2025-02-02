import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  SyncResponse,
  TxResponse,
  WalletResponse,
  WalletsResponse,
} from '../interfaces/wallet-interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  private apiUrl = `${environment.apiUrl}/wallets`;
  constructor(private http: HttpClient) {}

  getWallets(): Observable<WalletsResponse> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<WalletsResponse>(`${this.apiUrl}`, {
      headers,
    });
  }

  createWallet(walletName: string): Observable<WalletResponse> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const body = { name: walletName };
    return this.http.post<WalletResponse>(`${this.apiUrl}`, body, {
      headers,
    });
  }

  sendTransaction(
    walletId: string,
    toAddress: string,
    amountSatoshis: number,
    password: string
  ): Observable<TxResponse> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const body = { toAddress, amountSatoshis, password };

    return this.http.post<TxResponse>(
      `${this.apiUrl}/send-transaction/${walletId}`,
      body,
      { headers }
    );
  }

  syncWallet(walletId: string): Observable<SyncResponse> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<SyncResponse>(
      `${this.apiUrl}/sync/${walletId}`,
      {},
      {
        headers,
      }
    );
  }

  getWallet(walletId: string): Observable<WalletResponse> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<WalletResponse>(`${this.apiUrl}/${walletId}`, {
      headers,
    });
  }
}
