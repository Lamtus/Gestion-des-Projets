import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent {
  constructor(private router: Router) { }

  goHome(): void {
    this.router.navigate(['/']); // Or wherever your default authenticated route is
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
} 