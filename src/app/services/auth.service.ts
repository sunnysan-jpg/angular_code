
// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { BehaviorSubject, Observable } from 'rxjs';
// import { tap } from 'rxjs/operators';
// import { User } from '../models/user.model';
// import { Router } from '@angular/router';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private apiUrl = 'http://localhost:3000/api/auth';
//   private currentUserSubject = new BehaviorSubject<User | null>(null);
//   public currentUser$ = this.currentUserSubject.asObservable();

//   constructor(private http: HttpClient,private router:Router) {
//     this.loadCurrentUser();
//   }

//   register(userData: any): Observable<any> {
//     return this.http.post(`${this.apiUrl}/register`, userData).pipe(
//       tap((response: any) => {
//         if (response.token) {
//           localStorage.setItem('token', response.token);
//           this.currentUserSubject.next(response.user);
//         }
//       })
//     );
//   }

//   login(credentials: any): Observable<any> {
//     return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
//       tap((response: any) => {
//         if (response.token) {
//           localStorage.setItem('token', response.token);
//           this.currentUserSubject.next(response.user);
//         }
//       })
//     );
//   }

//   logout(): void {
//     localStorage.removeItem('token');
//     this.currentUserSubject.next(null);
//   }

//   getToken(): string | null {
//     return localStorage.getItem('token');
//   }

//   isAuthenticated(): boolean {
//     return !!this.getToken();
//   }

//   isAdmin(): boolean {
//     const user = this.currentUserSubject.value;
//     return user?.role === 'admin';
//   }

//   private loadCurrentUser(): void {
//     const token = this.getToken();
//     if (token) {
//       this.http.get(`${this.apiUrl}/profile`).subscribe(
//         (response: any) => {
//           this.currentUserSubject.next(response.user);
//         },
//         () => {
//           this.logout();
//         }
//       );
//     }
//   }

//   // google login


//     loginWithGoogle() {
//     window.location.href = 'http://localhost:3000/api/auth/google';
//   }

//   handleGoogleSuccess(token: string) {
//     localStorage.setItem('token', token);
//     console.log("tokem",token)

//         if (token) {
//       this.http.get(`${this.apiUrl}/profile`).subscribe(
//         (response: any) => {
//           this.currentUserSubject.next(response.user);
//         },
//         () => {
//           this.logout();
//         }
//       );
//     }
//     this.router.navigate(['/products']);
//   }
// }


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private readonly TOKEN_KEY = 'token';
  private readonly USER_KEY = 'mushroom_user';
  private readonly EXPIRY_KEY = 'mushroom_auth_expiry';
  private readonly IDLE_TIMEOUT = 30 * 60 * 1000; // 30 minutes

  constructor(private http: HttpClient, private router: Router) {
    // do not auto-load here if you prefer to call autoLogin from AppComponent
    // but keeping it here ensures session restore on service instantiation
    this.autoLogin();
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData).pipe(
      tap((response: any) => {
        if (response.token) {
          this.storeAuth(response.token, response.user);
        }
      })
    );
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        if (response.token) {
          this.storeAuth(response.token, response.user);
        }
      })
    );
  }

  // NEW: Save token, user and expiry
  private storeAuth(token: string, user: User | null) {
    localStorage.setItem(this.TOKEN_KEY, token);
    if (user) localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);

    // set expiry to now + IDLE_TIMEOUT
    const expiryMs = Date.now() + this.IDLE_TIMEOUT;
    localStorage.setItem(this.EXPIRY_KEY, String(expiryMs));
  }

  // Refresh expiry (called by IdleService on user activity)
  refreshExpiry() {
    const expiryMs = Date.now() + this.IDLE_TIMEOUT;
    localStorage.setItem(this.EXPIRY_KEY, String(expiryMs));
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.EXPIRY_KEY);
    this.currentUserSubject.next(null);
    // optional: navigate to login page
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === 'admin';
  }

  // Auto-login: restore token & user from localStorage and check token optional expiry (JWT)
  autoLogin(): boolean {
    const token = this.getToken();
    const userStr = localStorage.getItem(this.USER_KEY);

    if (!token) {
      return false;
    }

    // If token is JWT and has exp we could validate it here.
    // For simplicity assume token valid; server will reject invalid requests.
    const user = userStr ? JSON.parse(userStr) : null;
    this.currentUserSubject.next(user);

    // If there is no expiry entry (old session) set a fresh one
    if (!localStorage.getItem(this.EXPIRY_KEY)) {
      const expiryMs = Date.now() + this.IDLE_TIMEOUT;
      localStorage.setItem(this.EXPIRY_KEY, String(expiryMs));
    }
    return true;
  }

  // google login redirection (existing)
  loginWithGoogle() {
    window.location.href = 'http://localhost:3000/api/auth/google';
  }

  handleGoogleSuccess(token: string) {
    localStorage.setItem('token', token);
    // load profile from backend then set user and expiry
    this.http.get(`${this.apiUrl}/profile`).subscribe(
      (response: any) => {
        this.currentUserSubject.next(response.user);
        // set expiry
        const expiryMs = Date.now() + this.IDLE_TIMEOUT;
        localStorage.setItem(this.EXPIRY_KEY, String(expiryMs));
        this.router.navigate(['/products']);
      },
      () => this.logout()
    );
  }
}
