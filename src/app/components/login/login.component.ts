import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {NotificationService} from "../Utility/notification/notification.service";

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './login.component.html',
  standalone: true,
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  registrationForm!: FormGroup;
  private readonly hardcodedUsername = 'rav@gmail.com';
  private readonly hardcodedPassword = 'securePassword123';

  userService=inject(UserService)
  notificationService=inject(NotificationService)


  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remember: [false]
    });
  }

  onSubmit(): void {
    // if (this.registrationForm.valid) {
      this.userService.login(this.hardcodedUsername,this.hardcodedPassword).subscribe(
        data => {
          this.notificationService.showSuccess('Login Successfully!', 3000);
          localStorage.setItem('userData', JSON.stringify(data.data.userName));
          localStorage.setItem('userId', data.data.userId);
          this.router.navigate(['dashboard']);
        }
      )
    // } else {
    //   this.notificationService.showError('Login Failed!', 3000);
    //   console.log('Form is invalid');
    // }
  }

  // onSubmit(): void {
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //   // if (this.registrationForm.valid) {
  //   //   const { email, password } = this.registrationForm.value;
  //   //
  //   //   // Check hardcoded credentials
  //   //   if (email === this.hardcodedUsername && password === this.hardcodedPassword) {
  //   //     console.log('Login successful');
  //   //     this.router.navigate(['/admin']); // Navigate to the admin page
  //   //   } else {
  //   //     this.router.navigate(['/home']);
  //   //     alert('Wellcome to the dashbord..!');
  //   //   }
  //   // } else {
  //   //   console.log('Form is invalid');
  //   // }
  // }

  logOut(): void {
    localStorage.removeItem('userData');
    localStorage.clear();
    this.router.navigate(['login']);

  }
}
