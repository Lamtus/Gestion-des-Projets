import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TacheService } from '../../services/tache.service';
import { ProjetService } from '../../services/projet.service';
import { Tache } from '../../shared/tache.model';
import { Projet } from '../../shared/projet.model';
import { AuthService } from '../../services/auth.service';
import { User, Role } from '../../shared/user.model';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { forkJoin, Subscription } from 'rxjs';
import { gantt } from 'dhtmlx-gantt';

@Component({
  selector: 'app-task-dashboard',
  templateUrl: './task-dashboard.component.html',
  styleUrls: ['./task-dashboard.component.css']
})
export class TaskDashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('gantt_here') ganttContainer!: ElementRef;

  projectId!: number;
  projectName: string = '';
  taches: Tache[] = [];
  kanbanColumns: any = {};
  isLoading: boolean = true;
  currentView: string = 'kanban'; // 'kanban' or 'list' or 'gantt'
  currentUser: User | null = null;
  showAddTaskButton: boolean = false;
  isProjectManager: boolean = false;
  private dataSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute, 
    private tacheService: TacheService, 
    private projetService: ProjetService,
    private authService: AuthService,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getUserDetailsFromToken();
    this.showAddTaskButton = this.currentUser?.role !== Role.DIRECTEUR;
    this.isProjectManager = this.currentUser?.role === Role.MEMBRE_EQUIPE;
    
    this.route.paramMap.subscribe(params => {
      const id = params.get('projectId');
      if (id) {
        this.projectId = +id;
        this.loadProjectDetails(this.projectId);
        this.loadTasksForProject(this.projectId);
      }
    });
  }

  ngAfterViewInit(): void {
    gantt.init(this.ganttContainer.nativeElement);
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  loadProjectDetails(projectId: number): void {
    this.projetService.getProjetById(projectId).subscribe({
      next: (projet: Projet) => {
        this.projectName = projet.titre;
      },
      error: (error: any) => {
        console.error('Error fetching project details:', error);
        this.projectName = 'Projet Inconnu';
      }
    });
  }

  loadTasksForProject(projectId: number): void {
    this.isLoading = true;
    this.tacheService.getTachesByProjet(projectId).subscribe(
      (data: Tache[]) => {
        this.taches = data;
        console.log(this.taches);
        this.organizeTasksForKanban();
        this.isLoading = false;
      },
      (error: any) => {
        console.error('Error fetching tasks:', error);
        this.isLoading = false;
      }
    );
  }

  organizeTasksForKanban(): void {
    this.kanbanColumns = {
      'À faire': [],
      'En cours': [],
      'Bloqué': [],
      'Terminé': []
    };

    this.taches.forEach(tache => {
      switch (tache.statut.toUpperCase()) {
        case 'A_FAIRE':
          this.kanbanColumns['À faire'].push(tache);
          break;
        case 'EN_COURS':
          this.kanbanColumns['En cours'].push(tache);
          break;
        case 'BLOQUE':
          this.kanbanColumns['Bloqué'].push(tache);
          break;
        case 'TERMINE':
          this.kanbanColumns['Terminé'].push(tache);
          break;
        default:
          console.warn(`Statut de tâche inconnu: ${tache.statut}`);
          this.kanbanColumns['À faire'].push(tache);
      }
    });

    if (this.currentView === 'gantt' && this.taches.length > 0) {
      setTimeout(() => this.setupGanttChart(), 0);
    }
  }

  toggleView(view: string): void {
    this.currentView = view;
    if (view === 'gantt' && this.taches.length > 0) {
      this.setupGanttChart();
    }
  }

  onTaskDrop(event: CdkDragDrop<Tache[]>) {
    if (!this.isProjectManager) return;

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );

      // Update task status based on the new column
      const task = event.container.data[event.currentIndex];
      let newStatus = 'A_FAIRE';
      
      switch (event.container.id) {
        case 'À faire':
          newStatus = 'A_FAIRE';
          break;
        case 'En cours':
          newStatus = 'EN_COURS';
          break;
        case 'Bloqué':
          newStatus = 'BLOQUE';
          break;
        case 'Terminé':
          newStatus = 'TERMINE';
          break;
      }
      if(task.idTache)
      // Update task status in the backend
      this.tacheService.updateStatus(this.projectId, task.idTache, newStatus).subscribe(
        (updatedTask: Tache) => {
          console.log('Task status updated successfully:', updatedTask);
        },
        (error: any) => {
          console.error('Error updating task status:', error);
          // Revert the drag and drop if the update fails
          transferArrayItem(
            event.container.data,
            event.previousContainer.data,
            event.currentIndex,
            event.previousIndex,
          );
        }
      );
    }
  }

  setupGanttChart(): void {
    if (!this.ganttContainer?.nativeElement) {
      return;
    }

    gantt.config.date_format = "%Y-%m-%d";
    gantt.config.readonly = !this.isProjectManager;

    // Use the new scales configuration to fix the warning
    gantt.config.scales = [
        { unit: "month", step: 1, format: "%F, %Y" },
        { unit: "day", step: 1, format: "%j, %D" }
    ];

    gantt.config.columns = [
      { name: "text", label: "Tâche", tree: true, width: '*' },
      { name: "start_date", label: "Date de début", align: "center", width: 120 },
      { name: "duration", label: "Durée (j)", align: "center", width: 80 }
    ];

    // A little hack to make gantt redraw when switching views
    gantt.init(this.ganttContainer.nativeElement);

    const ganttData = this.taches.map(tache => ({
      id: tache.idTache,
      text: tache.titre,
      // Force dates into YYYY-MM-DD string format to fix the TypeError
      start_date: new Date(tache.dateDebut).toISOString().substring(0, 10),
      end_date: new Date(tache.dateFin).toISOString().substring(0, 10),
      progress: (tache.progression || 0) / 100,
      open: true
    }));

    gantt.parse({ data: ganttData, links: [] });
  }
} 