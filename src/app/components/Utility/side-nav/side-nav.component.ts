import {Component} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {DatePipe, NgClass, NgForOf, NgIf, SlicePipe} from "@angular/common";

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
    SlicePipe,
    DatePipe
  ],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss'
})
export class SideNavComponent {
  currentDateTime: Date = new Date();

  isSidebarOpen: boolean = false;
  isDropdownOpen: boolean = false;

  navigationItems: NavItem[] = [
    {label: 'Dashboard', route: '/dashboard'},
    {label: 'Profile', route: '/profile'},
    {label: 'Tunnel', route: '/Tunnel'},
    {label: 'Plant', route: '/plant'},
    {label: 'Schedule', route: '/schedule'},
    {label: 'Irrigation', route: '/Irrigation'},
    {label: 'Harvest', route: '/harvest'},

    {label: 'Reports', route: '/report'},
    {label: 'Alerts', route: '/alerts'},
    {label: 'Sign Up', route: '/register'},
    {label: 'Sign out', route: '/logout'}
  ];

  constructor(private router: Router) {
  }

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
