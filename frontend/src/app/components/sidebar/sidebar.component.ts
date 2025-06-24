import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../shared/user.model';
import { SidebarService } from '../../services/sidebar.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  currentUser: User | null = null;
  isCollapsed$: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private router: Router,
    private sidebarService: SidebarService
  ) {
    this.isCollapsed$ = this.sidebarService.isCollapsed$;
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getUserDetailsFromToken();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleSidebar(): void {
    this.sidebarService.toggle();
  }

  // Method to handle navigation for sidebar items
  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
} 