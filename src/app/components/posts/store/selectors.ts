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
