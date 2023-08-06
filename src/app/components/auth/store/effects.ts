import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@fe-app/services';
import * as AuthActions from '@fe-auth-store/actions';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';

@Injectable()
export class AuthEffects {
  constructor(
    private _authService: AuthService,
    private _actions$: Actions,
    private _router: Router
  ) {}
  authEffect$ = createEffect(() =>
    this._actions$.pipe(
      ofType(AuthActions.login),
      switchMap((action) => {
        return this._authService
          .login$(action.authData.email, action.authData.password)
          .pipe(
            map((res) => {
              this._router.navigate(['/']);
              return AuthActions.loginSuccess({
                expiresIn: res.expiresIn,
                token: res.token,
              });
            }),
            catchError((err: HttpErrorResponse) =>
              of(
                AuthActions.loginFailed({
                  message: err?.message || 'Unpexpected error occured',
                })
              )
            )
          );
      })
    )
  );
}
