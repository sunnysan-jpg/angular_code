import { Component } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      name: ['',[Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      role: ['user'],
      auth_provider: ['manual'],
      is_verified: [true]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.authService.register(this.registerForm.value).subscribe(
        () => {
          this.snackBar.open('Register successful!', 'Close', { duration: 3000 });
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
  }
}
