import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { User, Role } from '../../shared/user.model';
import { UserWithProjectCountDto } from '../../shared/user-with-project-count.model';

@Component({
  selector: 'app-team-members',
  templateUrl: './team-members.component.html',
  styleUrls: ['./team-members.component.css']
})
export class TeamMembersComponent implements OnInit {
  teamMembers: UserWithProjectCountDto[] = [];
  filteredMembers: UserWithProjectCountDto[] = [];
  currentUser: User | null = null;
  totalMembers: number = 0;
  onlineMembers: number = 0;
  availableMembers: number = 0;
  averageWorkload: number = 0;
  roles = Role;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadTeamMembers();
  }

  loadTeamMembers(): void {
    this.userService.getAllUsers().subscribe(members => {
      this.teamMembers = members;
      this.filterMembers();
      this.calculateStatistics();
    });
  }

  loadCurrentUser(): void {
    this.currentUser = this.authService.getCurrentUser();
  }

  filterMembers(): void {
    this.filteredMembers = this.teamMembers.filter(member => member.role !== Role.ADMIN);
  }

  calculateStatistics(): void {
    this.totalMembers = this.filteredMembers.length;
    // For demo purposes, we'll randomly set online and available status
    this.onlineMembers = Math.floor(Math.random() * this.totalMembers);
    this.availableMembers = Math.floor(Math.random() * this.onlineMembers);
    
    // Calculate average workload based on charge
    const totalWorkload = this.filteredMembers.reduce((acc, member) => acc + member.charge, 0);
    this.averageWorkload = this.totalMembers > 0 ? (totalWorkload / this.totalMembers) : 0;
  }

  isAdmin(): boolean {
    return this.currentUser?.role === Role.ADMIN;
  }

  getStatusClass(member: UserWithProjectCountDto): string {
    if (member.charge >= 80) return 'text-red-500';
    if (member.charge >= 50) return 'text-yellow-500';
    return 'text-green-500';
  }

  addMember(): void {
    this.router.navigate(['/add-member']);
  }
}
