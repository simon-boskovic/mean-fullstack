import { IAuthState } from '@fe-app/components/auth/models';
import { authActions } from '@fe-auth-store/actions';
import { createReducer, on } from '@ngrx/store';

export const initialState: IAuthState = {
  expiresIn: null,
  isLoading: false,
  token: null,
  error: null,
  isAuth: false,
};

export const authReducer = createReducer(
  initialState,
  on(authActions.login, (state, action) => {
    return { ...state, isLoading: true, error: null };
  }),
  on(authActions.loginSuccess, (state, action) => {
    return {
      ...state,
      isLoading: false,
      token: action.token,
      expiresIn: action.expiresIn,
      isAuth: true,
    };
  }),
  on(authActions.loginFailed, (state, action) => {
    return { ...state, isLoading: false, error: action.message };
  }),
  on(authActions.logout, (state) => {
    return initialState;
  }),
  on(authActions.autoAuthUserSuccess, (state, action) => {
    return {
      ...state,
      isAuth: true,
      token: action.token,
      expiresIn: action.expiresIn,
    };
  }),
  on(authActions.autoAuthUserFailed, (state) => {
    return { ...state, isAuth: false, token: null, isLoading: false };
  }),
  on(authActions.signup, (state) => {
    return { ...state, isLoading: true, error: null };
  }),
  on(authActions.signupFailed, (state, action) => {
    return { ...state, isLoading: false, error: action.message };
  }),
  on(authActions.signupSuccess, (state, action) => {
    return { ...state, isLoading: false, error: null };
  })
);
