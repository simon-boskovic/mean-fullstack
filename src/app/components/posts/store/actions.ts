import { IPost } from '@fe-app/models';
import { createActionGroup, props } from '@ngrx/store';

export const postsActions = createActionGroup({
  source: 'Post',
  events: {
    'Get Posts': props<{ pageIndex: number; pageSize: number }>(),
    'Get Posts Success': props<{ posts: IPost[]; maxPosts: number }>(),
    'Get Posts Failure': props<{ error: string }>(),
    'Get Post by ID': props<{ ID: string }>(),
    'Get Post by ID Success': props<{ post: IPost }>(),
    'Get Post by ID Failure': props<{ error: string }>(),
    'Update Post': props<{
      id: string;
      title: string;
      content: string;
      image: File | string;
    }>(),
    'Update Post Success': props<{ post: IPost }>(),
    'Update Post Failed': props<{ error: string }>(),
    'Create Post': props<{ post: IPost; image: File | string }>(),
    'Create Post Success': props<{ post: IPost }>(),
    'Create Post Failed': props<{ error: string }>(),
    'Delete Post': props<{ ID: string }>(),
    'Delete Post Success': props<{ ID: string }>(),
    'Delete Post Failed': props<{ error: string }>(),
  },
});
