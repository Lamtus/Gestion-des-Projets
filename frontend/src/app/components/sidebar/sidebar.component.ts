import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../shared/user.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  currentUser: User | null = null;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getUserDetailsFromToken();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Method to handle navigation for sidebar items
  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
} 