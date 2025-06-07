import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HttpClientModule} from "@angular/common/http";
import {SideNavComponent} from "./components/Utility/side-nav/side-nav.component";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HttpClientModule, SideNavComponent,],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.scss'
})

export class AppComponent {

}
