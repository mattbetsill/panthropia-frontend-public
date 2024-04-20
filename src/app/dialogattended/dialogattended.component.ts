import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';
import { ImageserviceService } from '../services/imageservice.service';
import { NotificationService } from '../services/notification.service';
import { UserService } from '../services/user.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'DialogAttended',
  templateUrl: '../event/dialog-dialog.html',
  styleUrls: ['../event/event.component.css'],
})
// tslint:disable-next-line:component-class-suffix
export class DialogAttended {
  additionalUsers: any[];
  orgUserList: any[];
  file: any;
  url: any;
  isIndependent: boolean;
  enableSelect = new FormControl(false);
  constructor(
    public dialogRef: MatDialogRef<DialogAttended>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notifService: NotificationService,
    private userservice: UserService,
    private auth: AuthService,
    private notif: NotificationService,
    private imageServie: ImageserviceService
  ) {
    console.log(this.data);

    this.userservice
      .getOrgMembers(this.auth.currentUserValue.orgref._id)
      .subscribe((users: any) => {
        this.orgUserList = users;
        this.orgUserList = this.orgUserList.filter(
          (user) =>
            user._id.toString() !== this.auth.currentUserValue._id.toString()
        );
      });
    this.isIndependent =
      this.auth.currentUserValue.orgref._id.toString() ===
      '6121cacad2fa956e04154965';
    this.additionalUsers = [];
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  displayNotif() {
    this.notif.showNotif('Please upload proof image.');
  }

  checkData() {
    if (!(this.data.event.proofrequired === true ? this.url : true)) {
      return false;
    }
    return true;
  }
  getUrl() {
    return {
      url: this.url,
      groupSubmission: this.enableSelect.value,
      additionalUserList: this.additionalUsers,
    };
  }
  async onFileChanged(event: any) {
    const localFile = event.target.files[0];

    this.url = await this.imageServie.resizeImage(500, localFile);

    this.file = localFile;

    console.log(this.additionalUsers);
  }
}
