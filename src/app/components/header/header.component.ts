import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthService } from '@fe-app/services';
import { authActions } from '@fe-auth-store/actions';
import { isAuth } from '@fe-auth-store/selector';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  isAuth$: Observable<boolean>;

  constructor(private _authService: AuthService, private _store: Store) {
    this.isAuth$ = this._store.select(isAuth);
  }

  onLogout() {
    this._authService.logout();
    this._store.dispatch(authActions.logout());
  }
}
