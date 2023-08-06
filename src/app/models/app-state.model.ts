import { IAuthState } from '@fe-app/components/auth/models';
import { IPostState } from '@fe-app/components/posts/models';

export interface IAppState {
  posts: IPostState;
  auth: IAuthState;
}
