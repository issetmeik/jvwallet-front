import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { WalletService } from '../../services/wallet.service';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-send-transaction',
  standalone: true,
  templateUrl: './send-transaction.component.html',
  styleUrls: ['./send-transaction.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    CardModule,
    ToastModule,
  ],
})
export class SendTransactionComponent implements OnInit {
  sendForm: FormGroup;
  walletId: string = '';
  address: string = '';
  walletIdInvalid = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private walletService: WalletService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {
    this.sendForm = this.fb.group({
      address: [
        '',
        [
          Validators.required,
          Validators.minLength(26),
          Validators.maxLength(35),
        ],
      ],
      amount: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d*\.?\d+$/),
          Validators.min(0.00001),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    this.walletId = this.route.snapshot.paramMap.get('walletId') || '';

    if (!this.walletId) {
      this.walletIdInvalid = true;
      this.showMessage(
        'error',
        'Erro!',
        'Carteira inválida. Redirecionando...'
      );
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 2000);
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

  sendTransaction() {
    if (this.sendForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Preencha os campos corretamente.',
      });
      return;
    }

    if (!this.walletId || !this.walletId) {
      this.walletIdInvalid = true;
      this.showMessage(
        'error',
        'Erro!',
        'Carteira inválida. Redirecionando...'
      );

      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 2000);
    }

    const { address, amount, password } = this.sendForm.value;

    const amountSatoshis = Math.round(amount * 100000000);

    this.walletService
      .sendTransaction(this.walletId, address, amountSatoshis, password)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso!',
            detail: 'Transação enviada com sucesso.',
          });
          setTimeout(
            () =>
              this.router.navigate(['/dashboard'], {
                queryParams: {
                  walletId: this.walletId,
                },
              }),
            2000
          );
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro ao enviar',
            detail:
              err.error.message || 'Ocorreu um erro ao enviar a transação.',
          });
        },
      });
  }

  cancel() {
    this.router.navigate(['/dashboard'], {
      queryParams: {
        walletId: this.walletId,
      },
    });
  }
}
