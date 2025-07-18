import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { CreateProjectComponent } from './components/create-project/create-project.component';
import { TaskDashboardComponent } from './components/task-dashboard/task-dashboard.component';
import { CreateTacheComponent } from './components/create-tache/create-tache.component';
import { MyTasksComponent } from './components/my-tasks/my-tasks.component';
import { AuthGuard } from './core/guards/auth.guard';
import { TeamMembersComponent } from './components/team-members/team-members.component';
import { AddMemberComponent } from './components/add-member/add-member.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path:'equipe',component:TeamMembersComponent,canActivate:[AuthGuard]},
  { path: 'add-member', component: AddMemberComponent, canActivate: [AuthGuard] },
  { path: 'create-project', component: CreateProjectComponent, canActivate: [AuthGuard] },
  { path: 'project-tasks/:projectId', component: TaskDashboardComponent, canActivate: [AuthGuard] },
  { path: 'projet/:projectId/create-tache', component: CreateTacheComponent, canActivate: [AuthGuard] },
  { path: 'my-tasks', component: MyTasksComponent, canActivate: [AuthGuard] },
  { path: '404', component: NotFoundComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/404' }, // Wildcard route for 404
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
