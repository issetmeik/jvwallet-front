import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TokenResponse } from '../../interfaces/login-interface';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    ToastModule,
  ],
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.loginForm = this.fb.group({
      login: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login!: string;
  password!: string;
  errorMessage!: string;

  showMessage(severity: string, summary: string, detail: string) {
    this.messageService.add({
      severity,
      summary,
      detail,
      life: 4000,
    });
  }

  loginUser() {
    if (this.loginForm.invalid) {
      this.showMessage(
        'warn',
        'Atenção',
        'Preencha todos os campos corretamente.'
      );
      this.loginForm.markAllAsTouched();
      return;
    }

    const { login, password } = this.loginForm.value;

    this.authService.login({ login, password }).subscribe(
      (res: TokenResponse) => {
        if (res.data) {
          localStorage.setItem('token', res.data.accessToken);
          this.router.navigateByUrl('dashboard');
        }
      },
      (error: any) => {
        this.showMessage('error', 'Erro!', 'Usuário ou senha incorretos');
      }
    );
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
