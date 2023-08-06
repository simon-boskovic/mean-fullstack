import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '@fe-app/services';
import { Observable, tap } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private _authService: AuthService, private _router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this._authService.isAuth$.pipe(
      tap((isAuth) => {
        if (!isAuth) {
          this._router.navigate(['/login']);
        }
      })
    );
  }
}
