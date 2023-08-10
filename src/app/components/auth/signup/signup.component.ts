import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IAppState } from '@fe-app/models';
import { authActions } from '@fe-auth-store/actions';
import { isLoadingSelector } from '@fe-auth-store/selector';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupComponent {
  isLoading$: Observable<boolean>;
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

  constructor(private _store: Store<IAppState>) {
    this.isLoading$ = this._store.select(isLoadingSelector);
  }

  onSignup() {
    if (!this.form.valid) {
      return;
    }
    const { email, password } = this.form.controls;

    this._store.dispatch(
      authActions.signup({ email: email.value, password: password.value })
    );
  }
}
