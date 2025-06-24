import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

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
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      const { email, password } = this.loginForm.value;
      
      this.authService.login(email, password).subscribe(
        response => {
          this.isLoading = false;
          // Navigate based on user role
          this.router.navigate([this.authService.getRedirectUrl()]);
        },
        error => {
          this.isLoading = false;
          this.errorMessage = 'La connexion a échoué. Veuillez vérifier vos identifiants.';
          console.error('Login failed', error);
        }
      );
    } else {
      this.errorMessage = 'Veuillez entrer un email et un mot de passe valides.';
    }
  }
} 