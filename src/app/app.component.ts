import {Component, OnInit} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {HttpClientModule} from "@angular/common/http";
import {SideNavComponent} from "./components/Utility/side-nav/side-nav.component";
import {NgIf} from "@angular/common";
import {NotificationComponent} from "./components/Utility/notification/notification.component";
import {NotificationService} from "./components/Utility/notification/notification.service";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HttpClientModule, SideNavComponent, NgIf, NotificationComponent,],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.scss'
})

export class AppComponent  implements OnInit {
  isLoggedIn = false;

  constructor(private router: Router, private notificationService: NotificationService) {}

  ngOnInit() {
    this.checkLoginStatus();
    this.router.events.subscribe(() => {
      this.checkLoginStatus();
    });

  }

  checkLoginStatus() {
    const userData = localStorage.getItem('userData');
    const currentRoute = this.router.url;
    this.isLoggedIn = !!userData && currentRoute !== '/login';
  }

  testNotification() {
    this.notificationService.showSuccess('Test notification!', 3000);
  }
}
