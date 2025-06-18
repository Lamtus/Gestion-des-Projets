import { Component, OnInit } from '@angular/core';
import { TacheService } from '../../services/tache.service';
import { AuthService } from '../../services/auth.service';
import { Tache } from '../../shared/tache.model';
import { User } from '../../shared/user.model';

@Component({
  selector: 'app-my-tasks',
  templateUrl: './my-tasks.component.html',
  styleUrls: ['./my-tasks.component.css']
})
export class MyTasksComponent implements OnInit {
  currentUser: User | null = null;
  myTasks: Tache[] = [];
  tasksInProgress: Tache[] = [];
  upcomingTasks: Tache[] = [];
  totalTasks: number = 0;
  completedTasks: number = 0;
  lateTasks: number = 0;
  completionRate: number = 0;
  currentTab: string = 'apercu'; // 'apercu', 'mes-taches', 'statistiques'
  totalTimeSpent: number = 0;
  totalEstimatedTime: number = 0;
  efficiencyRate: number = 0;
  projectDistribution: { [key: string]: { total: number, completed: number } } = {};

  constructor(
    private tacheService: TacheService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getUserDetailsFromToken();
    if (this.currentUser) {
      this.loadMyTasks(this.currentUser.id);
    }
  }

  loadMyTasks(userId: number): void {
    this.tacheService.getTachesByAssignee(userId).subscribe(
      (data: Tache[]) => {
        this.myTasks = data;
        this.organizeTasks();
        this.calculateSummary();
        this.calculateStatistics();
      },
      (error: any) => {
        console.error('Error fetching my tasks:', error);
      }
    );
  }

  organizeTasks(): void {
    this.tasksInProgress = this.myTasks.filter(t => t.statut === 'EN_COURS');
    // Assuming upcoming tasks are those not yet started or blocked and have a future end date
    this.upcomingTasks = this.myTasks.filter(t => 
      (t.statut === 'A_FAIRE' || t.statut === 'BLOQUE') && new Date(t.dateFin) > new Date()
    ).sort((a, b) => new Date(a.dateFin).getTime() - new Date(b.dateFin).getTime());
  }

  calculateSummary(): void {
    this.totalTasks = this.myTasks.length;
    this.completedTasks = this.myTasks.filter(t => t.statut === 'TERMINE').length;
    this.lateTasks = this.myTasks.filter(t => t.statut !== 'TERMINE' && new Date(t.dateFin) < new Date()).length;
    this.completionRate = this.totalTasks > 0 ? (this.completedTasks / this.totalTasks) * 100 : 0;
  }

  calculateStatistics(): void {
    // Calculer le temps passé en sommant l'estimation des tâches terminées
    this.totalTimeSpent = this.myTasks
      .filter(task => task.statut === 'TERMINE')
      .reduce((sum, task) => sum + (task.estimation || 0), 0);

    // Calculer le temps estimé restant en sommant l'estimation des tâches non terminées
    this.totalEstimatedTime = this.myTasks
      .filter(task => task.statut !== 'TERMINE')
      .reduce((sum, task) => sum + (task.estimation || 0), 0);

    // Calculer le temps total estimé pour toutes les tâches (pour le calcul de l'efficacité)
    const overallEstimatedTime = this.myTasks
      .reduce((sum, task) => sum + (task.estimation || 0), 0);

    this.efficiencyRate = overallEstimatedTime > 0 ? (this.totalTimeSpent / overallEstimatedTime) * 100 : 0;

    this.projectDistribution = {};
    this.myTasks.forEach(task => {
      const projectName = task.projet?.titre || 'Sans Projet';
      if (!this.projectDistribution[projectName]) {
        this.projectDistribution[projectName] = { total: 0, completed: 0 };
      }
      this.projectDistribution[projectName].total++;
      if (task.statut === 'TERMINE') {
        this.projectDistribution[projectName].completed++;
      }
    });
  }

  getTaskStatusClass(status: string): string {
    switch (status) {
      case 'EN_COURS': return 'status-en-cours';
      case 'TERMINE': return 'status-termine';
      case 'A_FAIRE': return 'status-a-faire';
      case 'BLOQUE': return 'status-bloque';
      default: return '';
    }
  }

  getTaskPriorityClass(priority: string): string {
    switch (priority) {
      case 'BASSE': return 'priority-basse';
      case 'MOYENNE': return 'priority-moyenne';
      case 'HAUTE': return 'priority-haute';
      default: return '';
    }
  }

  startTask(task: Tache): void {
    if (task.idTache && task.projet?.idProjet) {
      this.tacheService.updateStatus(task.projet.idProjet, task.idTache, 'EN_COURS').subscribe(
        () => {
          console.log('Task started successfully:', task.titre);
          this.loadMyTasks(this.currentUser!.id);
        },
        (error) => {
          console.error('Error starting task:', error);
        }
      );
    }
  }

  completeTask(task: Tache): void {
    if (task.idTache && task.projet?.idProjet) {
      this.tacheService.updateStatus(task.projet.idProjet, task.idTache, 'TERMINE').subscribe(
        () => {
          console.log('Task completed successfully:', task.titre);
          this.loadMyTasks(this.currentUser!.id);
        },
        (error) => {
          console.error('Error completing task:', error);
        }
      );
    }
  }

  selectTab(tabName: string): void {
    this.currentTab = tabName;
  }
} 