import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogAttended } from '../dialogattended/dialogattended.component';
import { AttendanceService } from '../services/attendance.service';
import { AuthService } from '../services/auth.service';
import { v4 as uuid } from 'uuid';
import { EventService } from '../services/event.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NotificationService } from '../services/notification.service';
import { NavigationService } from '../services/navigation.service';

@Component({
  selector: 'app-attendancepage',
  templateUrl: './attendancepage.component.html',
  styleUrls: ['./attendancepage.component.css'],
  providers: [DatePipe],
})
export class AttendancepageComponent implements OnInit {
  file;
  url;
  currentUser;
  eventData;
  constructor(
    private attendance: AttendanceService,
    private dialog: MatDialog,
    private auth: AuthService,
    private eventservice: EventService,
    private router: Router,
    private route: ActivatedRoute,
    private datepipe: DatePipe,
    private notif: NotificationService,
    private nav: NavigationService
  ) {
    this.currentUser = this.auth.currentUserValue;
    this.route.queryParams.subscribe((params: any) => {
      this.eventservice.getOneEvent(params.id).subscribe((event) => {
        this.eventData = event;
        if (params.code !== this.nav.getCode()) {
          this.notif.showNotif('Invalid Code!');
          this.router.navigate(['../timeline'], { relativeTo: this.route });
        }
        if (this.currentUser.role.toString() === 'Admin') {
          this.notif.showNotif('Organizations cannot submit attendance :(');
          this.router.navigate(['../timeline'], { relativeTo: this.route });
        } else {
          this.openDialogue();
        }
      });
    });
  }

  ngOnInit(): void {}

  openDialogue(): void {
    const dialogRef = this.dialog.open(DialogAttended, {
      width: '250px',
      data: { user: this.currentUser, event: this.eventData },
    });

    dialogRef.afterClosed().subscribe((result) => {
      const userCopy = JSON.parse(JSON.stringify(this.currentUser));
      if (!result) {
        this.router.navigate(['../timeline'], { relativeTo: this.route });
      }
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
                this.notif.showSuccess('Image Uploaded', 'Success');

                console.log('upload successful');
              } else {
                this.notif.showWarning('Image Uploade Failed...', 'Failed');

                console.error('upload failed');
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
      userCopy.eventname = this.eventData.eventName;
      userCopy.hostorg = this.eventData.hostref.organization;
      userCopy.hostcampus = this.eventData.campusref.name;
      userCopy.eventref = this.eventData.id;
      userCopy.campusref = this.currentUser.campusref._id;
      userCopy.hostcampusref = this.eventData.hostref.campusref;
      userCopy.userref = this.currentUser._id;
      userCopy.hostref = this.eventData.hostref._id;
      userCopy.userorgref = this.currentUser.orgref._id;
      userCopy.isgroupsubmission = result.groupSubmission;
      userCopy.qrcodescanned = true;
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

            this.router.navigate(['../timeline'], { relativeTo: this.route });
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
}
