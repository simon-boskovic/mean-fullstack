import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ERouteParam } from '@fe-app/enums';
import { IAppState, IPost } from '@fe-app/models';
import { postsActions } from '@fe-posts-store/actions';
import { isLoadingSelector, postByIDSelector } from '@fe-posts-store/selectors';
import { Store } from '@ngrx/store';
import { Observable, Observer, of, tap } from 'rxjs';

export const mimeType = (
  control: AbstractControl
): Observable<{ [key: string]: any }> => {
  if (typeof control.value === 'string') {
    return of(null);
  }
  const file = control.value as File;
  const fileReader = new FileReader();
  const frObs = new Observable((observer: Observer<{ [key: string]: any }>) => {
    fileReader.addEventListener('loadend', () => {
      const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(
        0,
        4
      );
      let header = '';
      let isValid = false;
      for (let i = 0; i < arr.length; i++) {
        header += arr[i].toString(16);
      }
      switch (header) {
        case '89504e47':
          isValid = true;
          break;
        case 'ffd8ffe0':
        case 'ffd8ffe1':
        case 'ffd8ffe2':
        case 'ffd8ffe3':
        case 'ffd8ffe8':
          isValid = true;
          break;
        default:
          isValid = false; // Or you can use the blob.type as fallback
          break;
      }
      if (isValid) {
        observer.next(null);
      } else {
        observer.next({ invalidMimeType: true });
      }
      observer.complete();
    });
    fileReader.readAsArrayBuffer(file);
  });
  return frObs;
};

@Component({
  selector: 'post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostCreateComponent implements OnInit, OnDestroy {
  post$: Observable<IPost>;
  isLoading$: Observable<boolean>;
  postID: string;
  form = new FormGroup({
    title: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    content: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    image: new FormControl<File | string>(null, {
      validators: [Validators.required],
      asyncValidators: [mimeType],
    }),
  });
  imagePreview: string | ArrayBuffer;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _cdr: ChangeDetectorRef,
    private _store: Store<IAppState>
  ) {
    this.isLoading$ = this._store.select(isLoadingSelector);
  }

  ngOnInit() {
    this.postID = this._activatedRoute.snapshot.paramMap.get(
      ERouteParam.PostID
    );
    if (this.postID) {
      this._store.dispatch(postsActions.getPostByID({ ID: this.postID }));

      this.post$ = this._store.select(postByIDSelector).pipe(
        tap((res) => {
          this.form.setValue({
            content: res?.content || '',
            title: res?.title || '',
            image: res?.imagePath || '',
          });
        })
      );
    }
  }

  onFileSelect(files: FileList) {
    const file = files.item(0);
    this.form.patchValue({ image: file });
    this.form.controls.image.updateValueAndValidity();

    this.imagePreview = URL.createObjectURL(file);
    this._cdr.markForCheck();
  }

  onAddPost() {
    if (this.form.invalid) {
      return;
    }
    const post: IPost = {
      title: this.form.controls.title.value,
      content: this.form.controls.content.value,
      imagePath: null,
    };
    const isUpdate = !!this.postID;

    this.post$ = null;

    this._store.dispatch(
      isUpdate
        ? postsActions.updatePost({
            content: post.content,
            id: this.postID,
            image: this.form.controls.image.value,
            title: post.title,
          })
        : postsActions.createPost({
            post: post,
            image: this.form.controls.image.value,
          })
    );
  }

  ngOnDestroy() {
    this.form.reset();
  }
}
