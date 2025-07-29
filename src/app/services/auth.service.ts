// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {

//   constructor() { }
// }



import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // private apiUrl = 'http://localhost:3000/api/auth';
  private apiUrl = 'https://ecommerce-mushroom.onrender.com/api/auth'
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient,private router:Router) {
    this.loadCurrentUser();
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          this.currentUserSubject.next(response.user);
        }
      })
    );
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          this.currentUserSubject.next(response.user);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === 'admin';
  }

  private loadCurrentUser(): void {
    const token = this.getToken();
    if (token) {
      this.http.get(`${this.apiUrl}/profile`).subscribe(
        (response: any) => {
          this.currentUserSubject.next(response.user);
        },
        () => {
          this.logout();
        }
      );
    }
  }

  // google login


    loginWithGoogle() {
    window.location.href = 'http://localhost:3000/api/auth/google';
  }

  handleGoogleSuccess(token: string) {
    localStorage.setItem('token', token);
    console.log("tokem",token)

        if (token) {
      this.http.get(`${this.apiUrl}/profile`).subscribe(
        (response: any) => {
          this.currentUserSubject.next(response.user);
        },
        () => {
          this.logout();
        }
      );
    }
    this.router.navigate(['/products']);
  }
}