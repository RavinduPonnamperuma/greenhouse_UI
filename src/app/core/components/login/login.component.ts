import { Component, OnDestroy, OnInit } from '@angular/core';
import {ActivatedRoute, RouterLink} from "@angular/router";
import { FormsModule } from '@angular/forms';
import {NgClass, NgIf} from "@angular/common";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgClass, NgIf, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {


}
