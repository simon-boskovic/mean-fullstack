import { IAppState } from '@fe-app/models';
import { createSelector } from '@ngrx/store';

export const selectFeature = (state: IAppState) => state.posts;

export const isLoadingSelector = createSelector(
  selectFeature,
  (state) => state.isLoading
);

export const postSelector = createSelector(
  selectFeature,
  (state) => state.posts
);

export const errorSelector = createSelector(
  selectFeature,
  (state) => state.error
);

export const postByIDSelector = createSelector(
  selectFeature,
  (state) => state.searchedPost
);
export const maxPostSelector = createSelector(
  selectFeature,
  (state) => state.maxPosts
);
