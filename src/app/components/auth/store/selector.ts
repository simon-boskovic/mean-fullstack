import { IAppState } from '@fe-app/models';
import { createSelector } from '@ngrx/store';

export const selectFeature = (state: IAppState) => state.auth;

export const isLoadingSelector = createSelector(
  selectFeature,
  (state) => state.isLoading
);

export const errorSelector = createSelector(
  selectFeature,
  (state) => state.error
);

export const isAuth = createSelector(selectFeature, (state) => state.isAuth);
