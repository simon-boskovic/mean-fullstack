import { IPostState } from '@fe-app/components/posts/models';
import { postsActions } from '@fe-posts-store/actions';
import { createReducer, on } from '@ngrx/store';

export const initialState: IPostState = {
  error: null,
  posts: [],
  isLoading: false,
  pageIndex: 0,
  pageSize: 2,
  searchedPost: null,
  maxPosts: null,
};

export const postReducer = createReducer(
  initialState,
  on(postsActions.getPosts, (state) => {
    return { ...state, isLoading: true };
  }),
  on(postsActions.getPostsSuccess, (state, action) => {
    return {
      ...state,
      isLoading: false,
      posts: action.posts,
      maxPosts: action.maxPosts,
    };
  }),
  on(postsActions.getPostsFailure, (state, action) => {
    return { ...state, isLoading: false, error: action.error };
  }),
  on(postsActions.getPostByID, (state) => {
    return { ...state, isLoading: true };
  }),
  on(postsActions.getPostByIDSuccess, (state, action) => {
    return { ...state, isLoading: false, searchedPost: action.post };
  }),
  on(postsActions.getPostByIDFailure, (state, action) => {
    return { ...state, isLoading: false, error: action.error };
  }),
  on(postsActions.createPostSuccess, (state) => {
    return { ...state, maxPosts: state.maxPosts + 1 };
  }),
  on(postsActions.updatePost, (state) => {
    return { ...state, isLoading: true };
  }),
  on(postsActions.updatePostSuccess, (state) => {
    return { ...state, isLoading: false };
  }),
  on(postsActions.updatePostFailed, (state, action) => {
    return { ...state, isLoading: false, error: action.error };
  }),
  on(postsActions.deletePost, (state) => {
    return { ...state, isLoading: true };
  }),
  on(postsActions.deletePostSuccess, (state, action) => {
    console.log(state);
    return {
      ...state,
      isLoading: false,
      posts: state.posts.filter((post) => post.id !== action.ID),
      maxPosts: state.maxPosts - 1,
    };
  }),
  on(postsActions.deletePostFailed, (state, action) => {
    return { ...state, isLoading: false, error: action.error };
  })
);
