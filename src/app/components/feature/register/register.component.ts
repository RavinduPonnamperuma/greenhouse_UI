import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

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

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      firstName: ['', [
        Validators.required, 
        Validators.minLength(2)
      ]],
      lastName: ['', [
        Validators.required, 
        Validators.minLength(2)
      ]],
      email: ['', [
        Validators.required, 
        Validators.email
      ]],
      phone: ['', [
        Validators.required, 
        Validators.pattern(/^\d{3}-\d{2}-\d{3}$/)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/)
      ]],
      confirmPassword: ['', [
        Validators.required
      ]],
      terms: [false, Validators.requiredTrue]
    }, { validators: this.passwordMatchValidator });
  }

  // Custom validator to check if passwords match
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    return password && confirmPassword && password.value === confirmPassword.value 
      ? null 
      : { passwordMismatch: true };
  }

  // Convenience getter for easy access to form fields
  get f() { return this.registrationForm.controls; }

  onSubmit() {
    this.submitted = true;

    // Stop here if form is invalid
    if (this.registrationForm.invalid) {
      return;
    }

    // TODO: Add your form submission logic here
    console.log(this.registrationForm.value);
    alert('Registration Successful!');
  }

  // Helper method to check if a field is invalid
  isFieldInvalid(fieldName: string): boolean {
    const field = this.registrationForm.get(fieldName);
    return field ? (field.invalid && (field.dirty || field.touched || this.submitted)) : false;
  }
}

