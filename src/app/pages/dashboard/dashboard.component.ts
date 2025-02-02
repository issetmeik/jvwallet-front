import { Component, OnInit, Input, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import {
  SyncResponse,
  Wallet,
  WalletsResponse,
  WalletResponse,
} from '../../interfaces/wallet-interface';
import { WalletService } from '../../services/wallet.service';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { delay } from 'rxjs/operators';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [
    CommonModule,
    ButtonModule,
    TableModule,
    DropdownModule,
    FormsModule,
    DialogModule,
    ToastModule,
    TooltipModule,
  ],
})
export class DashboardComponent implements OnInit {
  @Input() walletId?: string;

  wallets: Wallet[] = [];
  selectedWallet!: Wallet | null;
  transactions: any[] = [];
  newWalletName: string = '';
  display = false;

  constructor(
    private walletService: WalletService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const queryWalletId = params.get('walletId');
      this.walletId = this.walletId || queryWalletId || undefined;
    });

    this.walletService.getWallets().subscribe((res: WalletsResponse) => {
      if (res.data) {
        this.wallets = res.data;
        this.setSelectedWallet();
      }
    });
  }

  private setSelectedWallet() {
    if (this.walletId) {
      this.selectedWallet =
        this.wallets.find((wallet) => wallet.id === this.walletId) || null;
    } else if (this.wallets.length === 1) {
      this.selectedWallet = this.wallets[0];
    }

    if (this.selectedWallet) {
      this.transactions = this.selectedWallet.transactions;
    }
  }

  showMessage(severity: string, summary: string, detail: string) {
    this.messageService.add({
      severity,
      summary,
      detail,
      life: 4000,
    });
  }

  loadWalletDetails() {
    if (this.selectedWallet) {
      this.transactions = this.selectedWallet.transactions;
    }
  }

  convertToBTC(balance: string): number {
    const satoshis = Number(balance);
    return isNaN(satoshis) ? 0 : satoshis / 100_000_000;
  }

  shortenAddress(address: string | null): string {
    if (!address) return 'N/A';
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  }

  formatAmount(amount: number): string {
    return amount > 0 ? `+${amount}` : `${amount}`;
  }

  navigateToSend(walletId: string | undefined) {
    if (!walletId) return;
    this.router.navigate(['/send', walletId]);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  openDisplay() {
    this.display = true;
  }

  syncWallet() {
    if (!this.selectedWallet || !this.selectedWallet.id) {
      this.showMessage('warn', 'Atenção', 'Selecione a carteira');
      return;
    }

    const walletId = this.selectedWallet.id;

    this.walletService.syncWallet(walletId).subscribe((res: SyncResponse) => {
      if (res.data) {
        delay(3000);
        this.walletService
          .getWallet(walletId)
          .subscribe((res: WalletResponse) => {
            if (res.data) {
              this.selectedWallet = res.data;
              this.selectedWallet.id = res.data.id;
              this.selectedWallet.name = res.data.name;
            }
          });
      }
    });
  }

  newWallet() {
    if (!this.newWalletName || this.newWalletName.trim() === '') {
      this.showMessage('warn', 'Atenção', 'O nome da carteira é obrigatório.');
      return;
    }

    this.walletService.createWallet(this.newWalletName).subscribe({
      next: (response) => {
        this.wallets.push(response.data);
        this.newWalletName = '';
        this.selectedWallet = response.data;
        this.transactions = this.selectedWallet.transactions || [];
        this.display = false;
        this.showMessage('success', 'Sucesso', 'Carteira criada com sucesso!');
        this.router.navigate(['/dashboard'], {
          queryParams: {
            walletId: response.data.id,
          },
        });
      },
      error: (err) => {
        this.showMessage(
          'error',
          'Erro',
          err.error?.message || 'Falha ao criar a carteira.'
        );
      },
    });
  }
}
