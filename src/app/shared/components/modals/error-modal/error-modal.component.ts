import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'error-modal',
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorModalComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: string) {}
}
