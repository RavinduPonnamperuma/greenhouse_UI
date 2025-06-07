import { Component } from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {NgClass, NgForOf, NgIf, SlicePipe} from "@angular/common";

export interface NavItem {
  label: string;
  route: string;
}

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [
    RouterLink,
    NgIf,
    NgForOf,
    NgClass,
    SlicePipe
  ],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss'
})
export class SideNavComponent {
  isSidebarOpen: boolean = false;
  isDropdownOpen: boolean = false;

    navigationItems: NavItem[] = [
    { label: 'Dashboard', route: '/dashboard' },
    { label: 'Schedule', route: '/schedule' },
    { label: 'Inbox', route: '/inbox' },
    { label: 'Users', route: '/users' },
    { label: 'Products', route: '/products' },
    { label: 'Sign In', route: '/login' },
    { label: 'Sign Up', route: '/register' },
    { label: 'Settings', route: '/settings' },
    { label: 'Earnings', route: '/earnings' },
    { label: 'Sign out', route: '/logout' }
  ];

  constructor(private router: Router) {}

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
    this.isDropdownOpen = false; // Close dropdown after navigation
    this.isSidebarOpen = false; // Close sidebar on mobile after navigation
  }
}
