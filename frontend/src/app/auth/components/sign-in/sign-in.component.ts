import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent {
  signInForm: FormGroup;

  private authService = inject(AuthService);
  private snackbarService = inject(SnackbarService);
  private router = inject(Router);
  private dialogRef = inject(MatDialogRef<SignInComponent>);
  public isSendingData = false;

  public hidePassword = true;

  constructor() {
    this.signInForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  isValidField(field: string): boolean | null {
    return (
      this.signInForm.controls[field].errors &&
      this.signInForm.controls[field].touched
    );
  }

  getFieldError(field: string): string | null {
    if (!this.signInForm.controls[field]) return null;

    const errors = this.signInForm.controls[field].errors || {};
    for (const key of Object.keys(errors)) {
      if (key === 'required') {
        return 'Field is required';
      }
      if (key === 'email') {
        return 'Must be valid email';
      }
    }
    return null;
  }

  onSubmit(): void {
    if (this.signInForm.invalid) {
      this.signInForm.markAllAsTouched();
      this.snackbarService.openSnackBar(
        'Please correct any errors in the form before submitting it.'
      );
      return;
    }

    this.isSendingData = true;
    this.authService.signIn(this.signInForm.value).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          localStorage.setItem('token', res.data.token);
          this.snackbarService.openSnackBar(
            res.message || 'Login successfully.'
          );
          this.dialogRef.close();
          const data = {
            id: res.data.id,
            name: res.data.name,
            role: res.data.role,
          };
          this.authService.setCurrentUser(data);
          this.router.navigate(['/dashboard']);
        } else {
          this.snackbarService.openSnackBar(
            res.message || 'Login failed for unknown reasons.'
          );
        }
        this.isSendingData = false;
      },
      error: (err) => {
        let errorMessage = 'Something went wrong..';

        if (err.error.message) errorMessage = err.error.message;

        this.snackbarService.openSnackBar(errorMessage);
        this.isSendingData = false;
        console.error(err);
      },
    });
  }
}
