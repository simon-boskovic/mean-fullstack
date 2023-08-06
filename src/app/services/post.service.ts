import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPost } from '@fe-app/models';
import { ApiService } from '@fe-app/services';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  map,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private _posts: IPost[];
  private _posts$ = new BehaviorSubject<IPost[]>(null);
  posts$ = this._posts$.asObservable();
  allPostsCount$ = new BehaviorSubject<number>(null);

  constructor(private _apiService: ApiService, private _http: HttpClient) {}

  updatePost$(
    id: string,
    title: string,
    content: string,
    image: File | string
  ): Observable<IPost> {
    const post: IPost = { id, title, content, imagePath: null };
    let postData: FormData | IPost;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = { id, title, content, imagePath: image as string };
    }
    return this._apiService
      .put<IPost>(`http://localhost:3000/api/posts/${id}`, postData)
      .pipe(switchMap((updatedPost) => this._updatePostLocally$(updatedPost)));
  }

  getPost$(postID: string): Observable<IPost> {
    if (!postID) {
      return of({});
    }
    const fetchFunction = (posts: IPost[]) =>
      posts.find((post) => post.id === postID);

    return this.posts$.pipe(
      switchMap((posts) => {
        if (!posts) {
          return this.getPosts$().pipe(map(fetchFunction));
        }
        const searchedPost = fetchFunction(posts);
        if (!searchedPost) {
          return EMPTY;
        }
        return of(searchedPost);
      })
    );
  }

  getPosts$(postPerPage?: number, currentPage?: number): Observable<IPost[]> {
    let URL = 'http://localhost:3000/api/posts';
    const hasQueryPrams = postPerPage && currentPage;
    if (hasQueryPrams) {
      const queryParams = `?pageSize=${postPerPage}&page=${currentPage}`;
      URL = URL + queryParams;
    }

    return this._apiService.get<{ posts: IPost[]; maxPosts: number }>(URL).pipe(
      take(1),
      map((res) => {
        this.allPostsCount$.next(res.maxPosts);
        return res.posts.map((post) => ({
          title: post.title,
          content: post.content,
          id: post['_id'],
          imagePath: post.imagePath,
          creator: post.creator,
        }));
      }),
      switchMap((res) => {
        this._posts = res;
        this._posts$.next(this._posts);
        return this.posts$;
      })
    );
    return this.posts$;
  }

  deletePost$(postID: string): Observable<void> {
    return this._apiService
      .delete<void>(`http://localhost:3000/api/posts/${postID}`)
      .pipe(
        tap(() => {
          this._posts = this._posts.filter((post) => post.id !== postID);
          this._posts$.next(this._posts);
          this.allPostsCount$.next(this._posts.length);
        })
      );
  }

  addPost$(post: IPost, image: File) {
    const postData = new FormData();
    postData.append('title', post.title);
    postData.append('content', post.content);
    postData.append('image', image, post.title);
    return this._apiService
      .post<IPost>('http://localhost:3000/api/posts', postData)
      .pipe(
        tap((createdPost) => {
          post.id = createdPost.id;
          post.imagePath = createdPost.imagePath;
          this._posts.push(post);
          this._posts$.next([...this._posts]);
        })
      );
  }

  private _updatePostLocally$(post: IPost): Observable<IPost> {
    return this.posts$.pipe(
      take(1),
      map((posts) => {
        let updatingPostIndex = posts.findIndex((pst) => pst.id === post.id);
        posts[updatingPostIndex] = post;
        this._posts$.next(posts);
        return post;
      })
    );
  }
}
