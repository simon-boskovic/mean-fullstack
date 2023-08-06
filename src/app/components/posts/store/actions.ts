import { IPost } from '@fe-app/models';
import { createAction, props } from '@ngrx/store';

export const getPosts = createAction(
  '[Post] Get Posts',
  props<{ pageIndex: number; pageSize: number }>()
);
export const getPostsSuccess = createAction(
  '[Post] Get Posts Success',
  props<{ posts: IPost[] }>()
);
export const getPostsFailure = createAction(
  '[Post] Get Posts Failure',
  props<{ error: string }>()
);
