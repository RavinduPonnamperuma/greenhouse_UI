import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router, RouterLink} from "@angular/router";
import {DatePipe, NgClass, NgForOf, NgIf, SlicePipe} from "@angular/common";
import {filter} from "rxjs";

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
export class SideNavComponent implements OnInit {
  currentDateTime: Date = new Date();
  isSidebarOpen: boolean = false;
  isDropdownOpen: boolean = false;
  isLoggedIn = false;
  currentRoute: string = '';

  navigationItems: NavItem[] = [
    { label: 'Dashboard', route: '/dashboard' },
    { label: 'Tunnel', route: '/polytunnel' },
    { label: 'Plant', route: '/plant' },
    { label: 'Schedule', route: '/schedule' },
    { label: 'Irrigation', route: '/irrigation' },
    { label: 'Harvest', route: '/harvest' },
    { label: 'Reports', route: '/report' },
    { label: 'Alerts', route: '/alerts' },
    { label: 'Sign Up', route: '/register' },
    { label: 'Sign out', route: '/logout' }
  ];
  userName: string | null =''

  constructor(private router: Router) {}

  ngOnInit() {
    this.userName = JSON.parse(<string>localStorage.getItem('userData'));
    console.log(this.userName);
    this.checkLoginStatus();
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentRoute = event.urlAfterRedirects.split('?')[0]; // Strip query params
        this.checkLoginStatus();
      });
  }

  isActive(route: string): boolean {
    return this.currentRoute === route;
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
    this.isDropdownOpen = false;
    this.isSidebarOpen = false;
  }

  logOut(): void {
    localStorage.removeItem('userData');
    localStorage.clear();
    this.router.navigate(['login']);
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    const userData = localStorage.getItem('userData');
    const currentRoute = this.router.url;
    this.isLoggedIn = !!userData && currentRoute !== '/login';
  }
}
