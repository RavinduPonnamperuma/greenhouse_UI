import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './core/components/login/login.component';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './core/components/register/register.component';
import { ReactiveFormsModule } from '@angular/forms';


const appRoutes:Routes = [
  {path:'',component:LoginComponent},
  {path:'register',component:RegisterComponent},
]

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoutes),
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
