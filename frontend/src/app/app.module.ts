import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { CreateProjectComponent } from './components/create-project/create-project.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TaskDashboardComponent } from './components/task-dashboard/task-dashboard.component';
import { CreateTacheComponent } from './components/create-tache/create-tache.component';
import { TokenInterceptor } from './core/interceptors/token.interceptor';
import { ReplaceUnderscoreWithSpacePipe } from './shared/pipes/replace-underscore-with-space.pipe';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    SidebarComponent,
    NotFoundComponent,
    CreateProjectComponent,
    TaskDashboardComponent,
    CreateTacheComponent,
    ReplaceUnderscoreWithSpacePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    RouterModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
