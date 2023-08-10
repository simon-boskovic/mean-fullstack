import { ChangeDetectionStrategy, Component, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { IAppState } from '@fe-app/models';
import { ErrorModalComponent } from '@fe-app/shared/components/modals';
import { Store } from '@ngrx/store';
import { filter, switchMap, take } from 'rxjs';
import { errorSelector } from './auth/store';

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
    this.store
      .select(errorSelector)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((x) => !!x),
        switchMap((err) =>
          this.dialog
            .open(ErrorModalComponent, { width: '300px', data: err })
            .afterClosed()
            .pipe(take(1))
        )
      )
      .subscribe({ complete: () => console.log('COMPLETE') });
  }
}
