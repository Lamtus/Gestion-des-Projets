import { Component } from '@angular/core';
import { Router, NavigationEnd, Event as RouterEvent } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SidebarService } from './services/sidebar.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';
  showSidebar = false;
  isSidebarCollapsed$: Observable<boolean>;

  constructor(private router: Router, private sidebarService: SidebarService) {
    this.isSidebarCollapsed$ = this.sidebarService.isCollapsed$;

    this.router.events.pipe(
      filter((event: RouterEvent): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Hide sidebar on login and register pages
      if (event.urlAfterRedirects === '/login' || event.urlAfterRedirects === '/register' || event.urlAfterRedirects.includes('/change-password')) {
        this.showSidebar = false;
      } else {
        this.showSidebar = true;
      }
    });
  }
}
