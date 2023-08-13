import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { EQueryParam } from '@fe-app/enums';
import { IAppState, IPost } from '@fe-app/models';
import { PostService } from '@fe-app/services';
import { postsActions } from '@fe-posts-store/actions';
import { Store } from '@ngrx/store';

const DEFAULT_PAGE_INDEX = 0;
const DEFAULT_PAGE_SIZE = 2;
@Component({
  selector: 'post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostListComponent implements OnInit {
  @Input() isLoading: boolean;
  @Input() posts: IPost[] = [];
  @Input() maxCount: number;
  @Input() isAuth: boolean;
  @Input() error: string;
  pageSize: number;
  pageIndex: number;
  pageSizeOptions = [1, 2, 5, 10];

  constructor(
    private _postService: PostService,
    private _store: Store<IAppState>,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.pageIndex =
      +this._activatedRoute.snapshot.queryParamMap.get(EQueryParam.PageIndex) ||
      DEFAULT_PAGE_INDEX;
    this.pageSize =
      +this._activatedRoute.snapshot.queryParamMap.get(EQueryParam.PageSize) ||
      DEFAULT_PAGE_SIZE;

    this._dispatchGetPostsEvent(this.pageIndex, this.pageSize);

    this._cdr.markForCheck();
  }

  onDelete(ID: string) {
    this._store.dispatch(postsActions.deletePost({ ID: ID }));
  }

  onChangePage(pageData: PageEvent) {
    this.pageSize = pageData.pageSize;
    this.pageIndex = pageData.pageIndex;
    this._dispatchGetPostsEvent(pageData.pageIndex, pageData.pageSize);
    this._router.navigate([], {
      relativeTo: this._activatedRoute,
      queryParams: {
        pageIndex: pageData.pageIndex,
        pageSize: pageData.pageSize,
      },
      queryParamsHandling: 'merge',
    });
  }

  private _dispatchGetPostsEvent(currentPage: number, postsPerPage: number) {
    this._store.dispatch(
      postsActions.getPosts({
        pageIndex: currentPage + 1,
        pageSize: postsPerPage,
      })
    );
  }
}
