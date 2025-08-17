import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {NgClass, NgIf} from '@angular/common';
import { UserService } from '../../services/user.service';
import { NotificationService } from '../Utility/notification/notification.service';
import {UserDto} from "../../interfaces/user.interface";

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, NgIf, NgClass],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
})
export class RegisterComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private notificationService = inject(NotificationService);

  registrationForm!: FormGroup;
  submitted = false;
  isSubmitting = false;
  errorMessage: string | null = null;
  editingUser: UserDto | null = null;

  ngOnInit(): void {
    this.initializeForm();
    this.loadUserData();
  }

  private initializeForm(): void {
    this.registrationForm = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(3)]],
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
        address: ['', [Validators.required]],
        terms: [false, Validators.requiredTrue],
      },
      { validators: this.passwordMatchValidator.bind(this) }
    );
  }

  private passwordMatchValidator(form: FormGroup) {
    if (this.editingUser) return null; // Skip password validation in edit mode
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password && confirmPassword && password === confirmPassword
      ? null
      : { passwordMismatch: true };
  }

  get f() {
    return this.registrationForm.controls;
  }

  private loadUserData(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.userService.getById(userId).subscribe({
        next: (response) => {
          if (response.data) {
            this.editingUser = response.data;
            this.registrationForm.patchValue({
              username: response.data.userName,
              firstName: response.data.name.split(' ')[0],
              lastName: response.data.name.split(' ').slice(1).join(' '),
              email: response.data.email,
              phone: response.data.contact,
              address: response.data.address,
              terms: true, // Assume terms are agreed for existing users
            });
            // Disable password fields in edit mode
            this.registrationForm.get('password')?.disable();
            this.registrationForm.get('confirmPassword')?.disable();
          }
        },
        error: (err) => {
          console.error('Failed to fetch user data:', err);
          this.errorMessage = 'Failed to load user data. Please try again.';
          this.notificationService.showError(this.errorMessage, 5000);
        },
      });
    }
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = null;

    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const fullName = `${this.registrationForm.value.firstName} ${this.registrationForm.value.lastName}`;
    const userDTO: UserDto = {
      userName: this.registrationForm.value.username,
      name: fullName,
      email: this.registrationForm.value.email,
      contact: this.registrationForm.value.phone,
      address: this.registrationForm.value.address,
      role: 'user',
      status: this.editingUser ? 'active' : undefined,
    };

    if (!this.editingUser) {
      userDTO.password = this.registrationForm.value.password;
    } else {
      userDTO.id = this.editingUser.id;
    }

    const request = this.editingUser
      ? this.userService.update(this.editingUser.id!, userDTO)
      : this.userService.create(userDTO);

    request.subscribe({
      next: () => {
        this.notificationService.showSuccess(
          this.editingUser ? 'Profile updated successfully' : 'User registered successfully',
          3000
        );
        this.onReset();
      },
      error: (err) => {
        console.error(`Failed to ${this.editingUser ? 'update' : 'register'} user:`, err);
        this.errorMessage = `Failed to ${this.editingUser ? 'update profile' : 'register user'}. Please try again.`;
        this.notificationService.showError(this.errorMessage, 5000);
        this.isSubmitting = false;
      },
      complete: () => {
        this.isSubmitting = false;
      },
    });
  }

  onReset(): void {
    this.registrationForm.reset();
    this.submitted = false;
    this.errorMessage = null;
    this.editingUser = null;
    this.registrationForm.get('password')?.enable();
    this.registrationForm.get('confirmPassword')?.enable();
  }

  onNewUser(): void {
    this.onReset();
    this.registrationForm.reset();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registrationForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched || this.submitted) : false;
  }
}
