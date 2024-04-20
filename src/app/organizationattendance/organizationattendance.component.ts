import { Component, OnInit } from '@angular/core';
import { AttendanceService } from '../services/attendance.service';
import { EventService } from '../services/event.service';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationService } from '../services/navigation.service';

@Component({
  selector: 'app-organizationattendance',
  templateUrl: './organizationattendance.component.html',
  styleUrls: ['./organizationattendance.component.css'],
})
export class OrganizationattendanceComponent implements OnInit {
  events: any;
  attendanceRecords: any;
  attRecordsArr: any;
  eventArr: any;
  render: boolean;
  constructor(
    private attendanceservice: AttendanceService,
    private eventservice: EventService,
    private authservice: AuthService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private navservice: NavigationService
  ) {
    this.navservice.getAttendanceData().subscribe((date) => {
      this.attendanceservice
        .getOrgAttendance(
          this.authservice.currentUserValue.orgref
            ? this.authservice.currentUserValue.orgref._id
            : '000000000000'
        )
        .subscribe((result) => {
          this.attendanceRecords = result[0];
          this.events = result[1];

          this.eventArr = [];
          for (let i = 0; i < this.events.length; i++) {
            this.eventArr.push(this.events[i][0]);
          }
          if (date) {
            this.eventArr = this.eventArr.filter(
              (a) => new Date(date).getTime() < new Date(a.date).getTime()
            );
          } else {
            this.eventArr = this.eventArr.filter(
              (a) => new Date().getTime() < new Date(a.date).getTime()
            );
          }

          this.events = this.eventArr;
          this.events.sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );

          this.attRecordsArr = [];
          for (let i = 0; i < this.events.length; i++) {
            this.attRecordsArr.push(
              this.attendanceRecords[0].filter(
                (rec) =>
                  // tslint:disable-next-line:no-unused-expression
                  rec.eventref._id === this.events[i].id
              )
            );
          }

          this.attendanceRecords = this.attRecordsArr;
        });
    });
  }

  ngOnInit(): void {}
}
