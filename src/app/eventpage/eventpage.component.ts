import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { DialogAttended } from '../dialogattended/dialogattended.component';
import { User } from '../models/user';
import { AttendanceService } from '../services/attendance.service';
import { AuthService } from '../services/auth.service';
import { EventService } from '../services/event.service';
import { NavigationService } from '../services/navigation.service';
import { NotificationService } from '../services/notification.service';
import { v4 as uuid } from 'uuid';
import { DatePipe } from '@angular/common';
import { ImageserviceService } from '../services/imageservice.service';

@Component({
  selector: 'app-eventpage',
  templateUrl: './eventpage.component.html',
  styleUrls: ['./eventpage.component.css'],
  providers: [DatePipe],
})
export class EventpageComponent implements OnInit {
  thisevent: any;
  image: any;
  rendermenu: boolean;
  deleted: boolean = false;
  isarchived: boolean;
  currentUser: User;
  url: any;
  excuse: any;
  file: any;
  showOverlay: boolean = false;
  privOrgs: any;
  constructor(
    private eventserv: EventService,
    private route: ActivatedRoute,
    private attendance: AttendanceService,
    private auth: AuthService,
    private router: Router,
    private eventservice: EventService,
    private nav: NavigationService,
    private notif: NotificationService,
    public dialog: MatDialog,
    private datepipe: DatePipe,
    private imageService: ImageserviceService
  ) {
    this.loadEvent();
    this.currentUser = this.auth.currentUserValue;
  }

  ngOnInit(): void {}

  loadEvent() {
    this.thisevent = {};
    this.route.queryParams.subscribe((param) => {
      this.eventserv.getOneEvent(param.eventId).subscribe((event) => {
        this.thisevent = event;

        this.rendermenu =
          this.auth.currentUserValue &&
          this.auth.currentUserValue._id.toString() ===
            event.createdBy.toString();
        this.isarchived = event.archived;
        if (event.flyer) {
          this.attendance.gets3Get(event.flyer).subscribe((url) => {
            this.image = url;
          });
        } else {
          this.image = './assets/fulllogo.png';
        }
        if (this.currentUser) {
          this.eventserv.getPrivateOrgs(event._id).subscribe((orgs) => {
            this.privOrgs = orgs;
          });
        }
        if (
          this.currentUser &&
          this.currentUser.orgref &&
          this.currentUser.orgref._id === this.thisevent.hostref._id &&
          this.currentUser.role.toString() !== 'Admin' &&
          this.thisevent.acceptexcuses
        ) {
          this.excuse = true;
        }
      });
    });
  }

  navToTimeline() {
    this.router.navigate(['../timeline'], { relativeTo: this.route });
  }
  navigateOrg(orgid) {
    this.router.navigate(['../organizations'], {
      relativeTo: this.route,
      queryParams: { featured: 'false', orgid },
    });
  }
  qrCode() {
    this.router.navigate(['../qrcode'], {
      relativeTo: this.route,
      queryParams: { id: this.thisevent._id },
    });
  }
  openDialogue(): void {
    if (!this.currentUser) {
      this.router.navigate(['/userregister']);
      this.notif.showNotif('Make an account to submit attendance!', 'info');
      return;
    }
    const dialogRef = this.dialog.open(DialogAttended, {
      width: '250px',
      data: { user: this.currentUser, event: this.thisevent },
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
        if (this.thisevent.campus === null) {
          this.notif.showNotif(
            'try submitting on an actual event to see attendance on your account',
            'info'
          );
          return;
        }

        userCopy.proof = image;
        if (this.file) {
          this.notif.showInfo('Image Uploading...', 'Loading');
          this.imageService
            .resizeImage(500, this.file)
            .then((resizedFile: any) => {
              this.attendance
                .getS3Put(image)
                .subscribe(async (presignedPostData: any) => {
                  const formData = new FormData();
                  Object.keys(presignedPostData.fields).forEach((key) => {
                    formData.append(key, presignedPostData.fields[key]);
                  });
                  formData.append('file', resizedFile);
                  const upload = await fetch(presignedPostData.url, {
                    method: 'POST',
                    body: formData,
                  });
                  if (upload.ok) {
                    this.notif.showSuccess('Image Uploaded', 'Success');

                    console.log('upload successful');
                  } else {
                    console.error('upload failed');
                    this.notif.showWarning('Image Upload Failed', 'Failed');
                  }
                });
            });
        }

        userCopy.event = this.thisevent._id;
        let currDate = new Date();
        userCopy.date = currDate;
        userCopy.approvedByOrg = 'Pending';
        userCopy.approvedByEvent = 'Pending';
        userCopy.eventname = this.thisevent.eventName;
        userCopy.hostorg = this.thisevent.hostref.organization;
        userCopy.hostcampus = this.thisevent.campusref.name;
        userCopy.eventref = this.thisevent.id;
        userCopy.campusref = this.currentUser.campusref._id;
        userCopy.hostcampusref = this.thisevent.hostref.campusref;
        userCopy.userref = this.currentUser._id;
        userCopy.hostref = this.thisevent.hostref._id;
        userCopy.userorgref = this.currentUser.orgref._id;
        userCopy.isgroupsubmission = result.groupSubmission;
        console.log(userCopy);
      }

      if (result && result.url) {
        this.attendance.postAttendance(userCopy).subscribe((result) => {
          if (result) {
            this.notif.showNotif('Attendance recorded', 'confirm');
          }
        });
      }
      if (result && result.url && result.groupSubmission) {
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
      ['/campus/' + this.nav.getHeaderNameValue() + '/edit'],
      {
        queryParams: { id: this.thisevent._id },
      }
    );
  }

  deleteEvent() {
    this.eventservice.deleteEvent(this.thisevent._id).subscribe((result) => {
      console.log(result);
      this.deleted = true;
      this.loadEvent();
    });
  }

  archiveEvent() {
    this.thisevent.archived = !this.thisevent.archived;
    this.eventservice
      .editEvent(this.thisevent._id, this.thisevent)
      .pipe(first())
      .subscribe((result) => {
        this.isarchived = this.thisevent.archived;
        console.log(result);
        this.loadEvent();
      });
  }
}
