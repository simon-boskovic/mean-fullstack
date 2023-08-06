import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthService } from '@fe-app/services';
import { Observable } from 'rxjs';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  isAuth$: Observable<boolean>;

  constructor(private _authService: AuthService) {
    this.isAuth$ = this._authService.isAuth$;
  }

  onLogout() {
    this._authService.logout();
  }
}
