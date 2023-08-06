import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { IAuthData } from '@fe-app/models';
import { ApiService } from '@fe-app/services';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _token: string;
  private _isAuth$ = new BehaviorSubject<boolean>(false);
  private _tokenTimer: number;
  isAuth$ = this._isAuth$.asObservable();

  constructor(private _apiService: ApiService, private _router: Router) {}

  getToken(): string {
    return this._token;
  }

  login$(
    email: string,
    password: string
  ): Observable<{ token: string; expiresIn: number }> {
    const authData: IAuthData = {
      email,
      password,
    };
    return this._apiService
      .post<{ token: string; expiresIn: number }>(
        `http://localhost:3000/api/user/login`,
        authData
      )
      .pipe(
        tap((obj) => {
          const expiresInDuration = obj.expiresIn;
          this._setAuthTimer(expiresInDuration);
          const now = new Date();
          const expirationDate = new Date(
            now.getTime() + expiresInDuration * 1000
          );
          this._saveAuthData(obj.token, expirationDate);
          this._token = obj.token;
          this._isAuth$.next(true);
        })
      );
  }

  autoAuthUser() {
    const authInformation = this._getAuthData();
    if (!authInformation) {
      return;
    }

    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this._token = authInformation.token;
      this._isAuth$.next(true);
      this._setAuthTimer(expiresIn / 1000);
    }
  }

  logout() {
    this._token = null;
    this._isAuth$.next(false);
    this._router.navigate(['/']);
    this._clearAuthData();
    clearTimeout(this._tokenTimer);
  }

  createUser$(
    email: string,
    password: string
  ): Observable<{ message: string; email: string }> {
    const authData: IAuthData = {
      email,
      password,
    };
    return this._apiService.post<{ message: string; email: string }>(
      `http://localhost:3000/api/user/signup`,
      authData
    );
  }

  private _setAuthTimer(expiresInDuration: number) {
    this._tokenTimer = setTimeout(() => {
      this.logout();
    }, expiresInDuration * 1000);
  }

  private _getAuthData(): {
    token: string;
    expirationDate: Date;
  } | null {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');

    if (!token || !expirationDate) {
      return null;
    }

    return {
      token,
      expirationDate: new Date(expirationDate),
    };
  }

  private _saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private _clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }
}
