import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  registrationForm!: FormGroup;
  private readonly hardcodedUsername = 'admin@gmail.com';
  private readonly hardcodedPassword = 'admin123';

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remember: [false]
    });
  }

  // onSubmit(): void {
  //   if (this.registrationForm.valid) {
  //     console.log(this.registrationForm.value);
  //   } else {
  //     console.log('Form is invalid');
  //   }
  // }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      const { email, password } = this.registrationForm.value;

      // Check hardcoded credentials
      if (email === this.hardcodedUsername && password === this.hardcodedPassword) {
        console.log('Login successful');
        this.router.navigate(['/admin']); // Navigate to the admin page
      } else {
        this.router.navigate(['/home']);
        alert('Wellcome to the dashbord..!');
      }
    } else {
      console.log('Form is invalid');
    }
  }
}
