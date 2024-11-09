import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  password: string | undefined;
  userrname: string | undefined;

  show = false;
 
  ngOnInit(

  ) {
    
  }
  onClick() {
    if (this.password === 'password') {
      this.password = 'text';
      this.show = true;
    } else {
      this.password = 'password';
      this.show = false;
    }
  }


  constructor(private loginservice:LoginService,private router:Router){}

  loginForm= new FormGroup({
    'username':new FormControl('',Validators.required),
    'password':new FormControl('',Validators.required),
  })

  get Username(): FormControl{
    return this.loginForm.get("username") as FormControl;
  }
  get Password(): FormControl{
    return this.loginForm.get("password") as FormControl;
  }
  
  submitted: boolean = false;

   onSubmit() {
    console.log(this.loginForm);
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
  }

  login(){
   console.log("hiiii")

  }

}
