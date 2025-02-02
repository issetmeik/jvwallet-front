import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserResponse } from '../interfaces/user-interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;
  constructor(private http: HttpClient) {}

  register(credentials: {
    login: string;
    password: string;
  }): Observable<UserResponse> {
    return this.http.post<UserResponse>(this.apiUrl, credentials);
  }
}
