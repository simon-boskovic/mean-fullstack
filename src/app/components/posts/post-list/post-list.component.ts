import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Input,
  OnInit,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { IAppState, IPost } from '@fe-app/models';
import { PostService } from '@fe-app/services';
import { ErrorModalComponent } from '@fe-app/shared/components/modals';
import * as PostActions from '@fe-posts-store/actions';
import { errorSelector } from '@fe-posts-store/selectors';
import { Store } from '@ngrx/store';
import { filter, switchMap, take } from 'rxjs';
@Component({
  selector: 'post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostListComponent implements OnInit {
  @Input() isLoading: boolean;
  @Input() posts: IPost[] = [];
  @Input() allPostsCount: number;
  @Input() isAuth: boolean;
  @Input() error: string;
  destroyRef = inject(DestroyRef);
  totalPosts = 10;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];

  constructor(
    private _postService: PostService,
    private _store: Store<IAppState>,
    private _dialog: MatDialog
  ) {}

  ngOnInit() {
    this._dispatchGetPostsEvent(this.currentPage, this.postsPerPage);
    this._initErrorModalSelector();
  }

  onDelete(ID: string) {
    this._postService.deletePost$(ID).subscribe();
  }

  onChangePage(pageData: PageEvent) {
    this._dispatchGetPostsEvent(pageData.pageIndex + 1, pageData.pageSize);
  }

  private _dispatchGetPostsEvent(currentPage: number, postsPerPage: number) {
    this._store.dispatch(
      PostActions.getPosts({
        pageIndex: currentPage,
        pageSize: postsPerPage,
      })
    );
  }

  private _initErrorModalSelector() {
    this._store
      .select(errorSelector)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((x) => !!x),
        switchMap((err) =>
          this._dialog
            .open(ErrorModalComponent, { width: '300px', data: err })
            .afterClosed()
            .pipe(take(1))
        )
      )
      .subscribe();
  }
}
