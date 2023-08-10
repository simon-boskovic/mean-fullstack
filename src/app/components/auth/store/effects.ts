import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '@fe-app/services';
import { authActions } from '@fe-auth-store/actions';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';

const DEFAULT_ERROR_MESSAGE = 'Unpexpected error occured';

@Injectable()
export class AuthEffects {
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  constructor(
    private _authService: AuthService,
    private _actions$: Actions,
    private _router: Router,
    private _snackBar: MatSnackBar
  ) {}

  authEffect$ = createEffect(() =>
    this._actions$.pipe(
      ofType(authActions.login),
      switchMap((action) => {
        return this._authService
          .login$(action.authData.email, action.authData.password)
          .pipe(
            map((res) => {
              this._router.navigate(['/']);
              return authActions.loginSuccess({
                expiresIn: res.expiresIn,
                token: res.token,
              });
            }),
            catchError((err: HttpErrorResponse) =>
              of(
                authActions.loginFailed({
                  message: err.error?.message || DEFAULT_ERROR_MESSAGE,
                })
              )
            )
          );
      })
    )
  );

  signupEffect$ = createEffect(() =>
    this._actions$.pipe(
      ofType(authActions.signup),
      switchMap((action) =>
        this._authService.createUser$(action.email, action.password).pipe(
          map((res) => {
            this._router.navigate(['/login']);

            this._snackBar.open('User was created!', 'Close', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
            return authActions.signupSuccess({
              email: res.email,
              message: res.message,
            });
          }),
          catchError((err: HttpErrorResponse) =>
            of(
              authActions.signupFailed({
                message: err.error?.message ?? DEFAULT_ERROR_MESSAGE,
              })
            )
          )
        )
      )
    )
  );
}
