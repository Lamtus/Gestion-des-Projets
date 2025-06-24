import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { RegisterRequest } from 'src/app/shared/register-request.model';
import { Role } from 'src/app/shared/user.model';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.css']
})
export class AddMemberComponent {
  isLoading = false;
  user = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    poste: '',
    departement: '',
    role: Role.MEMBRE_EQUIPE
  };

  // Exposer l'enum Role directement pour le template
  roles = Role;
  
  constructor(private authService: AuthService, private router: Router) {}

  generateRandomPassword(length: number = 12): string {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
    let password = "";
    for (let i = 0, n = charset.length; i < n; ++i) {
        password += charset.charAt(Math.floor(Math.random() * n));
    }
    return password;
  }

  onSubmit(): void {
    this.isLoading = true;
    const registerPayload: RegisterRequest = {
      ...this.user,
      password: 'Passw0rd@'
    };

    this.authService.register(registerPayload)
    .pipe(
      finalize(() => this.isLoading = false)
    )
    .subscribe({
      next: (response) => {
        console.log('User registered successfully', response);
        alert('Membre ajouté avec succès!');
        this.router.navigate(['/equipe']);
      },
      error: (error) => {
        console.error('Error registering user', error);
        alert('Erreur lors de l\'ajout du membre.');
      }
    });
  }
}
