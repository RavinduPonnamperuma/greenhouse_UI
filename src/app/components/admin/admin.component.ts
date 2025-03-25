import { Component } from '@angular/core';
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";


@Component({
  selector: 'app-admin',
  imports: [],
  templateUrl: './admin.component.html',
  standalone: true,
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
constructor(private userService: UserService,private router: Router) {
}
  manageUser(){
    this.router.navigate(['/users']);
  }
  manageGhouse(){
  this.router.navigate(['/green-houses']);
  }
  manageSensor(){
  this.router.navigate(['/sensors']);
  }
  managePlant(){
  this.router.navigate(['/plants']);
  }
  contact(){
  this.router.navigate(['/contact']);
  }
}
