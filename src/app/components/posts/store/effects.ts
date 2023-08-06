import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PostService } from '@fe-app/services';
import * as PostAction from '@fe-posts-store/actions';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';

@Injectable()
export class PostEffects {
  constructor(private _action$: Actions, private _postsService: PostService) {}

  getPosts$ = createEffect(() =>
    this._action$.pipe(
      ofType(PostAction.getPosts),
      switchMap((action) =>
        this._postsService.getPosts$(action.pageSize, action.pageIndex).pipe(
          map((posts) => PostAction.getPostsSuccess({ posts })),
          catchError((err: HttpErrorResponse) => {
            return of(PostAction.getPostsFailure({ error: err.message }));
          })
        )
      )
    )
  );
}
