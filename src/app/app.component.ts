import {Component, OnInit} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {HttpClientModule} from "@angular/common/http";
import {SideNavComponent} from "./components/Utility/side-nav/side-nav.component";
import {NgIf} from "@angular/common";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HttpClientModule, SideNavComponent, NgIf,],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.scss'
})

export class AppComponent implements OnInit {


  isLoggedIn = false;

  constructor(private router: Router) {
  }



  ngOnInit() {
    this.checkLoginStatus();
    this.router.events.subscribe(() => {
      this.checkLoginStatus();
    });
  }



  checkLoginStatus() {
    const userData = localStorage.getItem('userData');
    const currentRoute = this.router.url;
    console.log(currentRoute);
    this.isLoggedIn = !!userData && currentRoute !== '/login';
  }
}
