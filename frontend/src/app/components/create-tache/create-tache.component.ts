import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TacheService } from '../../services/tache.service';
import { UserService } from '../../services/user.service';
import { Tache } from '../../shared/tache.model';
import { User } from '../../shared/user.model';
import { UserWithProjectCountDto } from '../../shared/user-with-project-count.model';
import { CreateTacheRequest } from '../../shared/create-tache-request.model';
import { Role } from '../../shared/user.model';

@Component({
  selector: 'app-create-tache',
  templateUrl: './create-tache.component.html',
  styleUrls: ['./create-tache.component.css']
})
export class CreateTacheComponent implements OnInit {
  tacheForm!: FormGroup;
  projectId!: number;
  
  availableMembers: UserWithProjectCountDto[] = [];
  antecedentTasks: Tache[] = [];

  priorities = ['Faible', 'Moyenne', 'Haute', 'Critique'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private tacheService: TacheService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('projectId');
      if (id) {
        this.projectId = +id;
        this.loadAntecedentTasks();
      }
    });

    this.tacheForm = this.fb.group({
      titre: ['', Validators.required],
      description: ['', Validators.required],
      priorite: [null, Validators.required],
      estimation: [null, [Validators.required, Validators.min(0)]],
      dateEcheance: ['', Validators.required],
      tags: [''],
      assigneA: [null, Validators.required],
      tachesAntecedentes: this.fb.array([])
    });

    // S'abonner aux changements de l'estimation pour s'assurer qu'elle est un nombre
    this.tacheForm.get('estimation')?.valueChanges.subscribe(value => {
      if (value !== null && value !== '') {
        const numValue = Number(value);
        if (!isNaN(numValue)) {
          this.tacheForm.patchValue({ estimation: numValue }, { emitEvent: false });
        }
      }
    });

    console.log('Initial form validity:', this.tacheForm.valid);

    this.loadAvailableMembers();
  }

  onAntecedentTaskChange(event: any) {
    const selectedTasks = (this.tacheForm.controls['tachesAntecedentes'] as FormArray);
    if (event.target.checked) {
      selectedTasks.push(new FormControl(event.target.value));
    } else {
      const index = selectedTasks.controls.findIndex(x => x.value === event.target.value);
      selectedTasks.removeAt(index);
    }
  }

  loadAvailableMembers(): void {
    this.userService.getAllUsers().subscribe({
      next: (members: UserWithProjectCountDto[]) => {
        this.availableMembers = members.filter(member => member.role === Role.MEMBRE_EQUIPE);
      },
      error: (error: any) => {
        console.error('Error loading available members:', error);
      }
    });
  }

  loadAntecedentTasks(): void {
    if (this.projectId) {
      this.tacheService.getTachesByProjet(this.projectId).subscribe({
        next: (tasks: Tache[]) => {
          this.antecedentTasks = tasks.filter(task => task.statut !== 'TERMINE'); // Only non-completed tasks
        },
        error: (error: any) => {
          console.error('Error loading antecedent tasks:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.tacheForm.valid) {
      const formValue = this.tacheForm.value;
      const nouvelleTache: CreateTacheRequest = {
        titre: formValue.titre,
        description: formValue.description,
        priorite: formValue.priorite,
        dateDebut: new Date(),
        dateFin: new Date(formValue.dateEcheance),
        statut: 'A_FAIRE',
        progression: 0,
        estimation: Number(formValue.estimation),  // Conversion explicite en nombre
        assigneId: formValue.assigneA,
        tags: formValue.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0),
        predecesseursIds: formValue.tachesAntecedentes
      };
      console.log('Nouvelle tâche à créer:', nouvelleTache);  // Log pour déboguer
      this.tacheService.createTache(this.projectId, nouvelleTache).subscribe({
        next: (response) => {
          console.log('Tâche créée avec succès:', response);
          this.router.navigate(['/project-tasks', this.projectId]);
        },
        error: (error) => {
          console.error('Erreur lors de la création de la tâche:', error);
        }
      });
    } else {
      this.tacheForm.markAllAsTouched();
      console.error('Formulaire invalide');
    }
  }

  getAvailabilityClass(availability: string): string {
    switch (availability) {
      case 'Disponible': return 'status available';
      case 'Occupé': return 'status occupied';
      case 'Partiellement disponible': return 'status partially-available';
      default: return 'status';
    }
  }

  getTaskStatusClass(status: string): string {
    switch (status) {
      case 'Terminé': return 'status complete';
      case 'En cours': return 'status in-progress';
      case 'À faire': return 'status todo';
      case 'Bloqué': return 'status blocked';
      default: return '';
    }
  }
} 