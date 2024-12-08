import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  registrationForm!: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder,private userService:UserService) {}

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(8)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      address: ['', [Validators.required]],
      terms: [false, Validators.requiredTrue],
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    return password && confirmPassword && password.value === confirmPassword.value
      ? null
      : { passwordMismatch: true };
  }

  get f() { return this.registrationForm.controls; }

  onSubmit() {
    this.submitted = true;

    // Stop here if form is invalid
    if (this.registrationForm.invalid) {
      console.log(this.registrationForm.value);
      return;
    }


    const userDTO={
      firstName: this.registrationForm.value.firstName,
      lastName: this.registrationForm.value.lastName,
      email: this.registrationForm.value.email,
      password: this.registrationForm.value.password,
      confirmPassword: this.registrationForm.value.confirmPassword,
      mobileNumber:this.registrationForm.value.phone,
      address: this.registrationForm.value.address,
      roleId: 1,

    }
    this.userService.createUser(userDTO).subscribe()
    console.log(this.registrationForm.value);
    alert('Registration Successful!');
  }


  isFieldInvalid(fieldName: string): boolean {
    const field = this.registrationForm.get(fieldName);
    return field ? (field.invalid && (field.dirty || field.touched || this.submitted)) : false;
  }
}
