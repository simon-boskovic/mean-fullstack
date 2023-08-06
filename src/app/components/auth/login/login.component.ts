import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { IAppState } from '@fe-app/models';
import { ErrorModalComponent } from '@fe-app/shared/components/modals';
import * as LoginActions from '@fe-auth-store/actions';
import { errorSelector, isLoadingSelector } from '@fe-auth-store/selector';
import { Store } from '@ngrx/store';
import { Observable, filter, switchMap, take } from 'rxjs';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  isLoading$: Observable<boolean>;
  destroyRef = inject(DestroyRef);

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

  constructor(private _store: Store<IAppState>, private _dialog: MatDialog) {
    this.isLoading$ = this._store.select(isLoadingSelector);
    this._initErrorModalSelector();
  }

  onLogin() {
    if (!this.form.valid) {
      return;
    }
    const { email, password } = this.form.controls;
    this._store.dispatch(
      LoginActions.login({
        authData: { email: email.value, password: password.value },
      })
    );
  }

  private _initErrorModalSelector() {
    this._store
      .select(errorSelector)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((x) => !!x),
        switchMap((err) =>
          this._dialog
            .open(ErrorModalComponent, { width: '300px', data: err })
            .afterClosed()
            .pipe(take(1))
        )
      )
      .subscribe();
  }
}
