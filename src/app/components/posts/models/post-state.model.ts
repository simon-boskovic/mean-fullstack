import { IPost } from '@fe-app/models';

export interface IPostState {
  isLoading: boolean;
  posts: IPost[];
  error: string | null;
  pageIndex: number;
  pageSize: number;
  searchedPost: IPost;
  maxPosts: number;
}
