import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { finalize } from 'rxjs/operators';
import { AuthResponse } from 'src/app/web/dto/auth-response';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm!: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  // Regex pour la validation du mot de passe
  private passwordPattern = '^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.changePasswordForm = this.fb.group({
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(this.passwordPattern)
      ]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.changePasswordForm.invalid) {
      if (this.changePasswordForm.get('newPassword')?.errors?.['pattern']) {
        this.errorMessage = 'Le mot de passe doit contenir au moins un chiffre, une lettre minuscule, une lettre majuscule et un caractère spécial';
      } else if (this.changePasswordForm.get('newPassword')?.errors?.['minlength']) {
        this.errorMessage = 'Le mot de passe doit contenir au moins 8 caractères';
      } else if (this.changePasswordForm.errors?.['mismatch']) {
        this.errorMessage = 'Les mots de passe ne correspondent pas';
      }
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const newPassword = this.changePasswordForm.get('newPassword')?.value;
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser?.email) {
      this.errorMessage = "Impossible de récupérer l'utilisateur actuel. Veuillez vous reconnecter.";
      this.isLoading = false;
      return;
    }

    this.authService.changePassword(currentUser.email, newPassword)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response: AuthResponse) => {
          if (response.token) {
            this.authService.saveToken(response.token);
            alert('Mot de passe changé avec succès ! ');
            this.router.navigate([this.authService.getRedirectUrl()]);
          } else {
            this.errorMessage = 'Erreur: Token manquant dans la réponse';
          }
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Une erreur est survenue lors du changement de mot de passe.';
          console.error('Erreur lors du changement de mot de passe:', err);
        }
      });
  }
} 