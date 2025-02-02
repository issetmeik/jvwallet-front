import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenResponse } from '../interfaces/login-interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/session`;
  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: {
    login: string;
    password: string;
  }): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(this.apiUrl, credentials);
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}
