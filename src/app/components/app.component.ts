import { ChangeDetectionStrategy, Component, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { IAppState } from '@fe-app/models';
import { ErrorModalComponent } from '@fe-app/shared/components/modals';
import { errorSelector as AuthErrorSelector } from '@fe-auth-store/selector';
import { errorSelector as PostErrorSelector } from '@fe-posts-store/selectors';
import { Store } from '@ngrx/store';
import { combineLatest, filter, map, switchMap, take } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  constructor(
    private store: Store<IAppState>,
    private dialog: MatDialog,
    private destroyRef: DestroyRef
  ) {
    this._initErrorModalSelector();
  }

  private _initErrorModalSelector() {
    combineLatest({
      authError: this.store.select(AuthErrorSelector),
      postError: this.store.select(PostErrorSelector),
    })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        map((errors) => {
          return ''
            .concat(errors.authError)
            .concat(errors.postError)
            .replaceAll('null', '');
        }),
        filter((x) => !!x),
        switchMap((err) =>
          this.dialog
            .open(ErrorModalComponent, { width: '300px', data: err })
            .afterClosed()
            .pipe(take(1))
        )
      )
      .subscribe();
  }
}
