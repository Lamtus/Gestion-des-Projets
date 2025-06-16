import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ProjetService } from '../../services/projet.service';
import { Projet } from '../../shared/projet.model';
import { Router } from '@angular/router';
import { User, Role } from '../../shared/user.model'; 

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  projets: Projet[] = [];
  currentUser: User | null = null;
  isDirecteur: boolean = false;
  isLoading: boolean = true; // Initialize to true to show loading on component init
  public Role = Role; // Expose Role enum to the template

  constructor(
    private authService: AuthService,
    private projetService: ProjetService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.checkUserRoleAndLoadProjects();
  }

  checkUserRoleAndLoadProjects(): void {
    this.currentUser = this.authService.getUserDetailsFromToken();
    if (this.currentUser) {
      if (this.currentUser.role === Role.DIRECTEUR) {
        this.isDirecteur = true;
        this.loadProjectsForDirecteur();
      } else if (this.currentUser.role === Role.MEMBRE_EQUIPE) {
        this.isDirecteur = false; // Membre_Equipe is not a director
        this.loadProjectsForMembre();
      } else {
        this.router.navigate(['/404']); // Redirect if unknown role or not allowed
        this.isLoading = false;
      }
    } else {
      this.router.navigate(['/login']); // Redirect if no user is logged in
      this.isLoading = false;
    }
  }

  loadProjectsForDirecteur(): void {
    this.isLoading = true; // Set loading to true before fetching
    this.projetService.getProjetsByDirecteur().subscribe(
      (data: Projet[]) => {
        this.projets = data;
        // Log the status of each project for debugging
        this.projets.forEach(projet => {
          console.log(`Projet: ${projet.titre}, Statut: ${projet.statut}`);
        });
        this.isLoading = false; // Set loading to false on success
      },
      (error: any) => {
        console.error('Error fetching projects for director', error);
        this.isLoading = false; // Set loading to false on error
        // Handle error, e.g., show error message
      }
    );
  }

  loadProjectsForMembre(): void {
    this.isLoading = true; // Set loading to true before fetching
    if (this.currentUser?.id) {
        this.projetService.getProjetsByChefId(this.currentUser.id).subscribe(
            (data: Projet[]) => {
                this.projets = data;
                this.projets.forEach(projet => {
                    console.log(`Projet (Membre): ${projet.titre}, Statut: ${projet.statut}`);
                });
                this.isLoading = false;
            },
            (error: any) => {
                console.error('Error fetching projects for member', error);
                this.isLoading = false;
            }
        );
    } else {
        console.warn('No current user ID found for loading member projects.');
        this.isLoading = false;
    }
  }

  createNewProject(): void {
    this.router.navigate(['/create-project']);
  }

  logout(): void {
    this.authService.logout(); // Clear the token
    this.router.navigate(['/login']); // Redirect to login page
  }

  viewProjectTasks(projectId: number): void {
    this.router.navigate(['/project-tasks', projectId]);
  }
} 