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
    // Initialization is now handled in setupGanttChart to support dynamic view switching.
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
    // Use clearAll instead of destructor to avoid issues when re-initializing the component
    if (gantt) {
      gantt.clearAll();
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
    if (view === 'gantt') {
      setTimeout(() => this.setupGanttChart(), 0);
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
    gantt.config.fit_tasks = true;

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

    // Re-initialize Gantt on the container, this is crucial when the element is recreated by *ngIf
    gantt.init(this.ganttContainer.nativeElement);

    let ganttData = this.taches.map(tache => {
      const startDate = new Date(tache.dateDebut);
      const endDate = new Date(tache.dateFin);
      let duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

      if (duration <= 0) {
        duration = 1; // Gantt tasks should have a duration of at least 1 day.
      }

      return {
        id: tache.idTache,
        text: tache.titre,
        start_date: startDate.toISOString().substring(0, 10),
        duration: duration,
        progress: (tache.progression || 0) / 100,
        open: true
      };
    });

    const ganttLinks = this.taches
      .filter(tache => tache.idTache !== undefined && tache.predecesseursIds)
      .flatMap(tache =>
        (tache.predecesseursIds || []).map(predecessorId => {
          const linkType = gantt.config.links.finish_to_start;
          return {
            id: `${predecessorId}-${tache.idTache!}`,
            source: predecessorId,
            target: tache.idTache!,
            type: String(linkType || '0')
          };
        })
      );

    // Manual auto-scheduling logic
    ganttData = this.manualSchedule(ganttData, ganttLinks);

    gantt.parse({ data: ganttData, links: ganttLinks });
  }

  // Basic manual scheduling function
  manualSchedule(tasks: any[], links: any[]): any[] {
    const taskMap = new Map(tasks.map(t => [t.id, t]));

    // Loop through links to adjust start dates
    links.forEach(link => {
      const predecessorTask = taskMap.get(link.source);
      const successorTask = taskMap.get(link.target);

      if (predecessorTask && successorTask) {
        const predecessorEndDate = new Date(predecessorTask.start_date);
        predecessorEndDate.setDate(predecessorEndDate.getDate() + predecessorTask.duration);

        const successorStartDate = new Date(successorTask.start_date);

        if (predecessorEndDate > successorStartDate) {
          // Successor starts before predecessor ends, so we reschedule it
          successorTask.start_date = predecessorEndDate.toISOString().substring(0, 10);
          taskMap.set(successorTask.id, successorTask); // Update the map with the new date
        }
      }
    });

    // Handle multiple levels of dependencies by iterating multiple times
    // A more robust solution might use a topological sort, but this is simpler for now
    for (let i = 0; i < tasks.length; i++) {
        links.forEach(link => {
            const predecessorTask = taskMap.get(link.source);
            const successorTask = taskMap.get(link.target);

            if (predecessorTask && successorTask) {
                const predecessorEndDate = new Date(predecessorTask.start_date);
                predecessorEndDate.setDate(predecessorEndDate.getDate() + predecessorTask.duration);

                const successorStartDate = new Date(successorTask.start_date);

                if (predecessorEndDate > successorStartDate) {
                    successorTask.start_date = predecessorEndDate.toISOString().substring(0, 10);
                    taskMap.set(successorTask.id, successorTask);
                }
            }
        });
    }


    return Array.from(taskMap.values());
  }

  hasUnscheduledTasks(tasks: any[], scheduledTasks: Set<any>): boolean {
    return tasks.some(t => !scheduledTasks.has(t.id));
  }
} 