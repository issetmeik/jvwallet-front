import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../services/auth.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TokenResponse } from '../../interfaces/login-interface';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { UserResponse } from '../../interfaces/user-interface';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    ToastModule,
  ],
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private userService: UserService
  ) {
    this.registerForm = this.fb.group(
      {
        login: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  showMessage(severity: string, summary: string, detail: string) {
    this.messageService.add({
      severity,
      summary,
      detail,
      life: 4000,
    });
  }

  passwordMatchValidator(formGroup: AbstractControl): ValidationErrors | null {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsNotMatch: true };
  }

  registerUser() {
    if (this.registerForm.invalid) {
      this.showMessage(
        'warn',
        'Atenção',
        'Preencha todos os campos corretamente.'
      );
      this.registerForm.markAllAsTouched();
      return;
    }

    const { login, password } = this.registerForm.value;

    this.userService.register({ login, password }).subscribe(
      (res: UserResponse) => {
        if (res.data) {
          this.showMessage(
            'success',
            'Sucesso',
            'Usuário criado com sucesso! Redirecionando para o login... '
          );
          setTimeout(() => {
            this.router.navigateByUrl('login');
          }, 2000);
        }
      },
      (error: any) => {
        this.showMessage(
          'error',
          'Erro!',
          error.error.message ||
            'Falha ao criar usuário, por favor tente novamente'
        );
      }
    );
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
