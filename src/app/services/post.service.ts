import { Injectable } from '@angular/core';
import { IPost } from '@fe-app/models';
import { ApiService } from '@fe-app/services';
import { Observable, map, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(private _apiService: ApiService) {}

  updatePost$(
    id: string,
    title: string,
    content: string,
    image: File | string
  ): Observable<IPost> {
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
    return this._apiService.put<IPost>(
      `http://localhost:3000/api/posts/${id}`,
      postData
    );
  }

  getPostbyID$(ID: string): Observable<IPost> {
    return this._apiService
      .get<{ post: IPost; status: number }>(
        'http://localhost:3000/api/posts/' + ID
      )
      .pipe(map((res) => res.post));
  }

  getPosts$(
    postPerPage?: number,
    currentPage?: number
  ): Observable<{ posts: IPost[]; maxPosts: number }> {
    let URL = 'http://localhost:3000/api/posts';
    const hasQueryPrams = postPerPage && currentPage;
    if (hasQueryPrams) {
      const queryParams = `?pageSize=${postPerPage}&page=${currentPage}`;
      URL = URL + queryParams;
    }

    return this._apiService.get<{ posts: IPost[]; maxPosts: number }>(URL).pipe(
      take(1),
      map((res) => {
        return {
          posts: res.posts.map((post) => ({
            title: post.title,
            content: post.content,
            id: post['_id'],
            imagePath: post.imagePath,
            creator: post.creator,
          })),
          maxPosts: res.maxPosts,
        };
      })
    );
  }

  deletePost$(postID: string): Observable<void> {
    return this._apiService.delete<void>(
      `http://localhost:3000/api/posts/${postID}`
    );
  }

  addPost$(post: IPost, image: File | string) {
    const postData = new FormData();
    postData.append('title', post.title);
    postData.append('content', post.content);
    postData.append('image', image as File, post.title);
    return this._apiService.post<IPost>(
      'http://localhost:3000/api/posts',
      postData
    );
  }
}
