import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ProjetService } from '../../services/projet.service';
import { User, Role } from '../../shared/user.model';
import { map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

interface ProjectManager {
  id: string;
  name: string;
  email: string;
  avatar: string;
  department: string;
  role: string;
  availability: string;
}

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css']
})
export class CreateProjectComponent implements OnInit {
  projectForm!: FormGroup;
  selectedTab: string = 'informations';
  isSubmitting: boolean = false;

  projectManagers: ProjectManager[] = [];

  constructor(private fb: FormBuilder, private userService: UserService, private projetService: ProjetService) { }

  ngOnInit(): void {
    this.projectForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      managerId: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: [null],
      priority: ['', Validators.required],
      status: ['non-commence'],
      budget: [null],
      category: [null]
    });

    this.loadProjectManagers();
  }

  loadProjectManagers(): void {
    this.userService.getAllUsers().pipe(
      map((users: any[]) => users.filter(user => user.role === Role.MEMBRE_EQUIPE).map(user => ({
        id: user.id.toString(),
        name: `${user.prenom} ${user.nom}`,
        email: user.email,
        avatar: '/placeholder.svg?height=40&width=40',
        department: user.departement,
        role: user.poste,
        availability: (() => {
          if (user.numberOfProjectsLed === 0) {
            return 'Disponible';
          } else if (user.numberOfProjectsLed >= 4) {
            return 'Occupé';
          } else {
            return 'Partiellement disponible';
          }
        })()
      })))
    ).subscribe(
      (managers: ProjectManager[]) => {
        this.projectManagers = managers;
        console.log(managers);
      },
      (error: any) => {
        console.error('Error fetching project managers', error);
      }
    );
  }

  onTabChange(tabName: string): void {
    this.selectedTab = tabName;
    this.projectForm.markAllAsTouched();
  }

  onSubmit(): void {
    this.isSubmitting = true;

    if (this.projectForm.valid) {
      const projectData = this.projectForm.value;
      console.log('Project data to be sent:', projectData);

      this.projetService.createProjet(projectData).subscribe({
        next: (response) => {
          console.log('Project created successfully:', response);
          this.isSubmitting = false;
          alert(`Projet "${response.titre}" créé avec succès !`);
          this.projectForm.reset();
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error creating project:', error);
          this.isSubmitting = false;
          let errorMessage = 'Une erreur est survenue lors de la création du projet.';
          if (error.error && typeof error.error === 'string') {
            errorMessage = `Erreur: ${error.error}`;
          } else if (error.message) {
            errorMessage = `Erreur: ${error.message}`;
          }
          alert(errorMessage);
        }
      });

    } else {
      this.isSubmitting = false;
      this.projectForm.markAllAsTouched();
    }
  }
}
