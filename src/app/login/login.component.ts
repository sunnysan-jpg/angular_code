import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth.service';
import { IdleService } from '../services/idle.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private idle: IdleService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.authService.login(this.loginForm.value).subscribe(
        () => {
          this.snackBar.open('Login successful!', 'Close', { duration: 3000 });
           this.idle.startWatching();
          this.router.navigate(['/products']);
        },
        error => {
          this.snackBar.open(error.error.message || 'Login failed', 'Close', { duration: 3000 });
          this.isLoading = false;
        }
      );
    }
  }

      googleLogin() {
    this.authService.loginWithGoogle();
     this.idle.startWatching();
  }  
}
