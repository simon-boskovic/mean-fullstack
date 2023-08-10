import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { isAuth } from '@fe-app/components/auth/store';
import { AuthService } from '@fe-app/services';
import { Store } from '@ngrx/store';
import { Observable, tap } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private _authService: AuthService,
    private _router: Router,
    private _store: Store
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this._store.select(isAuth).pipe(
      tap((isAuth) => {
        if (!isAuth) {
          this._router.navigate(['/login']);
        }
      })
    );
  }
}
