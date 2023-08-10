import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { IAppState, IPost } from '@fe-app/models';
import { PostService } from '@fe-app/services';
import * as PostActions from '@fe-posts-store/actions';
import { Store } from '@ngrx/store';
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
  totalPosts = 10;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];

  constructor(
    private _postService: PostService,
    private _store: Store<IAppState>
  ) {}

  ngOnInit() {
    this._dispatchGetPostsEvent(this.currentPage, this.postsPerPage);
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
}
