import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { PostService } from '@fe-app/services';
import { postsActions } from '@fe-posts-store/actions';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap } from 'rxjs';

@Injectable()
export class PostEffects {
  constructor(
    private _action$: Actions,
    private _postsService: PostService,
    private _router: Router
  ) {}

  getPosts$ = createEffect(() =>
    this._action$.pipe(
      ofType(postsActions.getPosts),
      switchMap((action) =>
        this._postsService.getPosts$(action.pageSize, action.pageIndex).pipe(
          map((res) =>
            postsActions.getPostsSuccess({
              posts: res.posts,
              maxPosts: res.maxPosts,
            })
          ),
          catchError((err: HttpErrorResponse) => {
            return of(postsActions.getPostsFailure({ error: err.message }));
          })
        )
      )
    )
  );

  getPostsByID$ = createEffect(() =>
    this._action$.pipe(
      ofType(postsActions.getPostByID),
      switchMap((action) =>
        this._postsService.getPostbyID$(action.ID).pipe(
          map((res) => postsActions.getPostByIDSuccess({ post: res })),
          catchError(() => {
            return of(
              postsActions.getPostByIDFailure({ error: 'Post not found' })
            );
          })
        )
      )
    )
  );

  updatePost$ = createEffect(() =>
    this._action$.pipe(
      ofType(postsActions.updatePost),
      switchMap((action) =>
        this._postsService
          .updatePost$(action.id, action.title, action.content, action.image)
          .pipe(
            map((res) => postsActions.updatePostSuccess({ post: res })),
            tap(() => {
              this._router.navigate(['/'], { queryParamsHandling: 'preserve' });
            }),
            catchError((err) =>
              of(postsActions.updatePostFailed({ error: err.message }))
            )
          )
      )
    )
  );

  createPost$ = createEffect(() =>
    this._action$.pipe(
      ofType(postsActions.createPost),
      switchMap((action) =>
        this._postsService.addPost$(action.post, action.image).pipe(
          map((res) => postsActions.createPostSuccess({ post: res })),
          tap(() => {
            this._router.navigate(['/']);
          }),
          catchError((err) =>
            of(postsActions.createPostFailed({ error: err.message }))
          )
        )
      )
    )
  );
  deletePost$ = createEffect(() =>
    this._action$.pipe(
      ofType(postsActions.deletePost),
      switchMap((action) =>
        this._postsService.deletePost$(action.ID).pipe(
          map(() => {
            return postsActions.deletePostSuccess({ ID: action.ID });
          }),
          catchError((err) =>
            of(postsActions.deletePostFailed({ error: err.message }))
          )
        )
      )
    )
  );
}
