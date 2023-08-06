import { IAuthState } from '@fe-app/components/auth/models';
import * as AuthActions from '@fe-auth-store/actions';
import { createReducer, on } from '@ngrx/store';

export const initialState: IAuthState = {
  expiresIn: null,
  isLoading: false,
  token: null,
  error: null,
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.login, (state, action) => {
    return { ...state, isLoading: true, error: null };
  }),
  on(AuthActions.loginSuccess, (state, action) => {
    return {
      ...state,
      isLoading: false,
      token: action.token,
      expiresIn: action.expiresIn,
    };
  }),
  on(AuthActions.loginFailed, (state, action) => {
    return { ...state, isLoading: false, error: action.message };
  })
);
