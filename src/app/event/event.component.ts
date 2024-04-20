import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  Inject,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import { UserService } from '../services/user.service';
import { EventService } from '../services/event.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user';
import { Role } from '../models/role';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { AttendanceService } from '../services/attendance.service';
import { NotificationService } from '../services/notification.service';
import { CompressorConfig, ImageCompressorService } from 'ngx-image-compressor';
import { DatePipe } from '@angular/common';
import { v4 as uuid } from 'uuid';
import { first } from 'rxjs/operators';
import { error } from '@angular/compiler/src/util';
import { FormControl } from '@angular/forms';
import { DialogAttended } from '../dialogattended/dialogattended.component';
import { ExcuseService } from '../services/excuse.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css'],
  providers: [DatePipe],
})
export class EventComponent implements OnInit {
  @Input() eventData;
  @Input() organization;
  @Output() delete = new EventEmitter<any>();
  @Output() refresh = new EventEmitter<any>();
  title: string;
  host: string;
  charity: string;
  time: string;
  eventname: string;
  event: any;
  image: any;
  info: string;
  infoPresent: boolean;
  rendermenu: boolean;
  renderinfo: boolean;
  currentUser: User;
  userRole: Role;
  showOverlay: boolean;
  eventID: string;
  togglestyle: string;
  url: any;
  file: any;
  archived = true;
  loading = false;
  excuse = false;
  constructor(
    private userservice: UserService,
    private router: Router,
    private authService: AuthService,
    public dialog: MatDialog,
    private attendance: AttendanceService,
    private notif: NotificationService,
    private activeroute: ActivatedRoute,
    private datepipe: DatePipe,
    private eventservice: EventService,
    private excuseservice: ExcuseService
  ) {
    this.renderinfo = false;
    this.currentUser = this.authService.currentUserValue;

    this.userRole = Role.user;
    this.showOverlay = false;

    this.togglestyle = '144px';
  }

  ngOnInit(): void {
    this.event = this.eventData;
    this.title = this.eventData.eventName;
    this.host = this.eventData.hostref.organization;
    this.charity = this.eventData.charity;
    this.info = this.eventData.info;
    this.infoPresent =
      this.eventData.info ||
      this.eventData.eventType === 'Philanthropy' ||
      this.eventData.hasLocation;
    this.archived = this.eventData.archived;
    if (
      this.currentUser &&
      this.currentUser.orgref &&
      this.currentUser.orgref._id === this.event.hostref._id &&
      this.currentUser.role.toString() !== 'Admin' &&
      this.event.acceptexcuses
    ) {
      this.excuse = true;
    }
    this.eventID = this.eventData._id;
    this.time =
      this.TwelveHourFormat(this.eventData.starttime) +
      ' - ' +
      this.TwelveHourFormat(this.eventData.endtime);
    this.eventname = this.eventData.eventName;
    if (this.eventData.flyer) {
      this.attendance.gets3Get(this.eventData.flyer).subscribe((url) => {
        this.image = url;
      });
    } else {
      this.image = './assets/fulllogo.png';
    }

    this.rendermenu =
      this.authService.currentUserValue &&
      this.authService.currentUserValue.orgref &&
      this.authService.currentUserValue.orgref.organization === this.host &&
      this.authService.currentUserValue.role === Role.admin;
  }

  qrCode() {
    this.router.navigate(['../qrcode'], {
      relativeTo: this.activeroute,
      queryParams: { id: this.eventData._id },
    });
  }

  navToEvent() {
    this.router.navigate(['../event'], {
      relativeTo: this.activeroute,
      queryParams: { eventId: this.eventData._id },
    });
  }

  openDialog(): void {
    if (!this.currentUser) {
      this.router.navigate(['/userregister']);
      this.notif.showNotif('Make an account to submit attendance!', 'info');
      return;
    }
    this.loading = true;
    const dialogRef = this.dialog.open(DialogAttended, {
      width: '250px',
      data: { user: this.currentUser, event: this.eventData },
    });

    dialogRef.afterClosed().subscribe((result) => {
      const userCopy = JSON.parse(JSON.stringify(this.currentUser));
      console.log(result);
      if (result && result.url) {
        this.file = result.url;
        const reader = new FileReader();
        reader.onload = (e) => {
          this.url = e.target.result;
        };
        reader.readAsDataURL(this.file);

        const image = 'proof/' + uuid() + this.file.name;
        if (this.eventData.campus === null) {
          this.notif.showNotif(
            'try submitting on an actual event to see attendance on your account',
            'info'
          );
          return;
        }

        userCopy.proof = image;
        if (this.file) {
          this.notif.showInfo('Image Uploading...', 'Loading');
          this.attendance
            .getS3Put(image)
            .subscribe(async (presignedPostData: any) => {
              const formData = new FormData();
              Object.keys(presignedPostData.fields).forEach((key) => {
                formData.append(key, presignedPostData.fields[key]);
              });
              formData.append('file', this.file);
              const upload = await fetch(presignedPostData.url, {
                method: 'POST',
                body: formData,
              });
              if (upload.ok) {
                console.log('upload successful');
                this.notif.showSuccess(
                  'Image Successfully Uploaded',
                  'Success'
                );
              } else {
                console.error('upload failed');
                this.notif.showWarning('Image Upload Failed', 'Failed');
              }
            });
        }
      }

      if (!result) {
        return;
      }

      userCopy.event = this.eventData._id;
      let currDate = new Date();
      userCopy.date = currDate;
      userCopy.approvedByOrg = 'Pending';
      userCopy.approvedByEvent = 'Pending';
      userCopy.eventname = this.eventname;
      userCopy.hostorg = this.eventData.hostref.organization;
      userCopy.hostcampus = this.eventData.campusref.name;
      userCopy.eventref = this.eventData.id;
      userCopy.campusref = this.currentUser.campusref._id;
      userCopy.hostcampusref = this.eventData.hostref.campusref;
      userCopy.userref = this.currentUser._id;
      userCopy.hostref = this.eventData.hostref._id;
      userCopy.userorgref = this.currentUser.orgref._id;
      userCopy.isgroupsubmission = result.groupSubmission;
      userCopy.qrcodescanned = false;
      userCopy.hasproofimage = this.eventData.proofrequired;
      console.log(userCopy);

      if (
        result &&
        !(this.eventData.proofrequired === true ? result.url : true)
      ) {
        this.notif.showNotif('Please add proof image.');
        return;
      }

      if (result) {
        this.attendance.postAttendance(userCopy).subscribe((result) => {
          if (result) {
            this.notif.showSuccess(
              'Attendance Successfully Uploaded',
              'Success'
            );
          }
        });
      }
      if (result && result.groupSubmission) {
        for (let i = 0; i < result.additionalUserList.length; i++) {
          userCopy.userref = result.additionalUserList[i];
          this.attendance.postAttendance(userCopy).subscribe((result) => {
            console.log(result);
          });
        }
      }
    });
  }

  open() {
    this.showOverlay = true;
  }
  close() {
    this.showOverlay = false;
  }

  excuseSubmission() {
    this.router.navigate(['../excusesubmission'], {
      relativeTo: this.activeroute,
      queryParams: { id: this.event._id },
    });
  }

  TwelveHourFormat(time) {
    const dtParts = time.split(':');

    let hours = dtParts[0];
    const minutes = dtParts[1];
    let suffix = 'AM';

    if (hours > 12) {
      hours = hours - 12;
      suffix = 'PM';
    } else if (hours === '00') {
      hours = 12;
      suffix = 'AM';
    } else if (hours === '12') {
      suffix = 'PM';
    }

    return hours + ':' + minutes + ' ' + suffix;
  }

  editEvent() {
    this.router.navigate(
      ['/campus/' + this.eventData.campusref.name + '/edit'],
      {
        queryParams: { id: this.eventData._id },
      }
    );
  }

  deleteEvent() {
    this.delete.emit(this.eventData);
  }

  archiveEvent() {
    this.eventData.archived = !this.eventData.archived;
    this.eventservice
      .editEvent(this.eventData.id, this.eventData)
      .pipe(first())
      .subscribe((result) => {
        this.refresh.emit(true);
      });
  }

  toggleInfo() {
    this.renderinfo = !this.renderinfo;
    this.togglestyle = this.togglestyle === '1000px' ? '144px' : '1000px';
  }

  toggleText() {
    return this.renderinfo ? 'See Less▲' : 'See More▼';
  }

  navigate(event) {
    this.router.navigate(['../organizations'], {
      relativeTo: this.activeroute,
      queryParams: { orgname: event.target.innerText, featured: false },
    });
  }

  goToEvent() {
    this.router.navigate(['../event'], {
      relativeTo: this.activeroute,
      queryParams: { eventId: this.eventData._id },
    });
  }
}
// @Component({
//   // tslint:disable-next-line:component-selector
//   selector: 'DialogAttended',
//   templateUrl: 'dialog-dialog.html',
//   styleUrls: ['./event.component.css']
// })
// // tslint:disable-next-line:component-class-suffix
// export class DialogAttended {

//   additionalUsers: any[];
//   orgUserList: any[];
//   file: any;
//   url: any;
//   isIndependent: boolean;
//   enableSelect = new FormControl(false);
//   constructor(public dialogRef: MatDialogRef<DialogAttended>,
//     @Inject(MAT_DIALOG_DATA) public data: any,
//     private notifService: NotificationService,
//     private userservice: UserService,
//     private auth: AuthService) {

//     this.userservice.getOrgMembers(this.auth.currentUserValue.orgref._id).subscribe((users: any) => {
//       this.orgUserList = users;
//       this.orgUserList = this.orgUserList.filter((user) => user._id.toString() !== this.auth.currentUserValue._id.toString());

//       console.log(this.orgUserList);
//     })
//     this.isIndependent = this.auth.currentUserValue.orgref._id.toString() === '6121cacad2fa956e04154965';
//     this.additionalUsers = [];

//   }

//   onNoClick(): void {
//     this.dialogRef.close();
//   }
//   getUrl() {

//     return {
//       url: this.url,
//       groupSubmission: this.enableSelect.value,
//       additionalUserList: this.additionalUsers
//     };
//   }
//   async onFileChanged(event: any) {

//     const localFile = event.target.files[0];

//     this.file = localFile;
//     this.url = localFile;
//     console.log(this.additionalUsers)

//   }

// }
