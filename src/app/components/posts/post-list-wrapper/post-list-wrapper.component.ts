import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IAppState, IPost } from '@fe-app/models';
import { AuthService, PostService } from '@fe-app/services';
import {
  errorSelector,
  isLoadingSelector,
  postSelector,
} from '@fe-posts-store/selectors';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'post-list-wrapper',
  templateUrl: './post-list-wrapper.component.html',
  styleUrls: ['./post-list-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostListWrapperComponent {
  posts$: Observable<IPost[]>;
  allPostsCount$: Observable<number>;
  isAuth$: Observable<boolean>;
  isLoading$: Observable<boolean>;
  error$: Observable<string>;

  constructor(
    private _authService: AuthService,
    private _store: Store<IAppState>,
    private _postService: PostService
  ) {
    this.isLoading$ = this._store.select(isLoadingSelector);
    this.isAuth$ = this._authService.isAuth$;
    this.allPostsCount$ = this._postService.allPostsCount$;
    this.posts$ = this._store.select(postSelector);
    this.error$ = this._store.select(errorSelector);
  }
}