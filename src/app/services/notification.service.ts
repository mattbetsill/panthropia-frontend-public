import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(
    public snackBar: MatSnackBar,
    private zone: NgZone,
    private toastr: ToastrService
  ) {}

  public showNotif(message, action = 'error', duration = 4000): void {
    // consider not using zone. However, the snackbar is know not to work outside it.
    // zone is a built in service that allows running async tasks that don't require UI updates.
    // this.zone.run(() => {

    this.snackBar
      .open(message, action, { duration, panelClass: 'snackbar' })
      .onAction()
      .subscribe(() => {
        console.log('Notififcation action performed');
      });
  }

  public notImplementedWarning(message, duration = 4000): void {
    // @ts-ignore
    this.snackBar
      .open(`"${message}" is not implemented`, 'error', { duration })
      .onAction()
      .subscribe(() => {});
  }

  showSuccess(message, title) {
    console.log('showsuccess');
    this.toastr.success(message, title);
  }

  showError(message, title) {
    this.toastr.error(message, title);
  }

  showInfo(message, title) {
    this.toastr.info(message, title);
  }

  showWarning(message, title) {
    this.toastr.warning(message, title);
  }
}
