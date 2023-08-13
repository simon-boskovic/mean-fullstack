import { ChangeDetectionStrategy, Component } from '@angular/core';
import { isAuth } from '@fe-app/components/auth/store';
import { IAppState, IPost } from '@fe-app/models';
import {
  errorSelector,
  isLoadingSelector,
  maxPostSelector,
  postSelector,
} from '@fe-posts-store/selectors';
import { Store } from '@ngrx/store';
import { Observable, tap } from 'rxjs';

@Component({
  selector: 'post-list-wrapper',
  templateUrl: './post-list-wrapper.component.html',
  styleUrls: ['./post-list-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostListWrapperComponent {
  posts$: Observable<IPost[]>;
  isAuth$: Observable<boolean>;
  isLoading$: Observable<boolean>;
  error$: Observable<string>;
  maxCount$: Observable<number>;

  constructor(private _store: Store<IAppState>) {
    this.isLoading$ = this._store.select(isLoadingSelector);
    this.isAuth$ = this._store.select(isAuth).pipe(tap(console.log));
    this.posts$ = this._store.select(postSelector);
    this.error$ = this._store.select(errorSelector);
    this.maxCount$ = this._store.select(maxPostSelector);
  }
}
