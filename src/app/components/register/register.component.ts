import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './register.component.html',
  standalone: true,
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  registrationForm!: FormGroup;
  submitted = false;
  isSubmitting = false;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private userService: UserService) {}

  ngOnInit(): void {
    this.registrationForm = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(3)]],
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.minLength(10)]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
        address: ['', [Validators.required]],
        terms: [false, Validators.requiredTrue],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password && confirmPassword && password === confirmPassword
      ? null
      : { passwordMismatch: true };
  }

  get f() {
    return this.registrationForm.controls;
  }

  async onSubmit() {
    this.submitted = true;
    this.errorMessage = null;

    if (this.registrationForm.invalid) {
      return;
    }

    this.isSubmitting = true;

    const fullName = `${this.registrationForm.value.firstName} ${this.registrationForm.value.lastName}`;
    const userDTO = {
      userName: this.registrationForm.value.username,
      name: fullName,
      email: this.registrationForm.value.email,
      password: this.registrationForm.value.password,
      contact: this.registrationForm.value.phone,
      address: this.registrationForm.value.address,
      role: 'user',
    };

    try {
      this.userService.create(userDTO).subscribe({
        next: (res) => {
          console.log(res)
        }
      })
      alert('Registration Successful!');
      this.registrationForm.reset();
      this.submitted = false;
    } catch (error: any) {
      this.errorMessage = error.message || 'An error occurred during registration. Please try again.';
    } finally {
      this.isSubmitting = false;
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registrationForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched || this.submitted) : false;
  }
}
