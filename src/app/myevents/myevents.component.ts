import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AttendanceService } from '../services/attendance.service';
import { EventService } from '../services/event.service';
import { AuthService } from '../services/auth.service';
import { NavigationService } from '../services/navigation.service';

@Component({
  selector: 'app-myevents',
  templateUrl: './myevents.component.html',
  styleUrls: ['./myevents.component.css'],
})
export class MyeventsComponent implements OnInit {
  events: any;
  attendanceRecords: any;
  toggle: any;
  constructor(
    private attendanceservice: AttendanceService,
    private eventservice: EventService,
    private authservice: AuthService,
    private navservice: NavigationService,
    private cdr: ChangeDetectorRef
  ) {
    this.toggle = false;
    this.navservice.getAttendanceData().subscribe((date) => {
      this.eventservice
        .getEvent(this.authservice.currentUserValue._id)
        .subscribe((events) => {
          this.events = events;
          this.events = this.events.sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );
          if (date) {
            this.events = this.events.filter(
              (a) => new Date(date).getTime() < new Date(a.date).getTime()
            );
          } else {
            this.events = this.events.filter(
              (a) => new Date().getTime() < new Date(a.date).getTime()
            );
          }

          this.attendanceservice
            .getAttendance(this.events)
            .subscribe((result) => {
              this.attendanceRecords = result;

              this.toggle = true;
            });
        });
    });
  }
  ngOnInit(): void {}
}
