import { IPostState } from '@fe-app/components/posts/models';
import * as PostAction from '@fe-posts-store/actions';
import { createReducer, on } from '@ngrx/store';

export const initialState: IPostState = {
  error: null,
  posts: [],
  isLoading: false,
  pageIndex: 0,
  pageSize: 2,
};

export const postReducer = createReducer(
  initialState,
  on(PostAction.getPosts, (state) => {
    return { ...state, isLoading: true };
  }),
  on(PostAction.getPostsSuccess, (state, action) => {
    return { ...state, isLoading: false, posts: action.posts };
  }),
  on(PostAction.getPostsFailure, (state, action) => {
    return { ...state, isLoading: false, error: action.error };
  })
);
