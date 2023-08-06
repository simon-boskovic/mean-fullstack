import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@fe-app/services';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupComponent {
  isLoading = false;
  form = new FormGroup({
    email: new FormControl<string>('', [
      Validators.required,
      Validators.email,
      Validators.minLength(3),
    ]),
    password: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(3),
    ]),
  });

  constructor(
    private _authService: AuthService,
    private _cdr: ChangeDetectorRef
  ) {}

  onSignup() {
    if (!this.form.valid) {
      return;
    }
    this.isLoading = true;
    const { email, password } = this.form.controls;
    this._authService
      .createUser$(email.value, password.value)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this._cdr.markForCheck();
        })
      )
      .subscribe();
  }
}
