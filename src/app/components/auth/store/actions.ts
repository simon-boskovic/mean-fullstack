import { IAuthData } from '@fe-app/models';
import { createAction, props } from '@ngrx/store';

export const login = createAction(
  '[Auth] Login',
  props<{ authData: IAuthData }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ expiresIn: number; token: string }>()
);

export const loginFailed = createAction(
  '[Auth] Login Failed',
  props<{ message: string }>()
);

export const logout = createAction('[Auth] Logout');
