import { IAuthData } from '@fe-app/models';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const authActions = createActionGroup({
  source: 'Auth',
  events: {
    Login: props<{ authData: IAuthData }>(),
    'Login Success': props<{ expiresIn: number; token: string }>(),
    'Login Failed': props<{ message: string }>(),
    Logout: emptyProps(),
    'Auto Auth User Success': props<{ expiresIn: number; token: string }>(),
    'Auto Auth User Failed': emptyProps,
    Signup: props<{ email: string; password: string }>(),
    'Signup Success': props<{ message: string; email: string }>(),
    'Signup Failed': props<{ message: string }>(),
  },
});
