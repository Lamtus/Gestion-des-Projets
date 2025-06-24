import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private collapsed = new BehaviorSubject<boolean>(false);
  isCollapsed$ = this.collapsed.asObservable();

  constructor() { }

  toggle(): void {
    this.collapsed.next(!this.collapsed.value);
  }

  setCollapsed(isCollapsed: boolean): void {
    this.collapsed.next(isCollapsed);
  }
} 