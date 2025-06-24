import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Redirect if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate([this.authService.getRedirectUrl()]);
    }

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.errorMessage = null;

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: ({ user }) => {
          if (user.firstLogin) {
            this.router.navigate(['/change-password']);
          } else {
            this.router.navigate([this.authService.getRedirectUrl()]);
          }
        },
        error: (error) => {
          this.errorMessage = 'Email ou mot de passe incorrect.';
          console.error('Login error', error);
        }
      });
  }
} 