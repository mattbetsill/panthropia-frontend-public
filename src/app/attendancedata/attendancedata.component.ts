import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AttendanceService } from '../services/attendance.service';
import { EventService } from '../services/event.service';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationService } from '../services/navigation.service';

@Component({
  selector: 'app-attendancedata',
  templateUrl: './attendancedata.component.html',
  styleUrls: ['./attendancedata.component.css'],
})
export class AttendancedataComponent implements OnInit {
  events: any;
  attendanceRecords: any;
  date: string;
  currTab: string;
  constructor(
    private attendanceservice: AttendanceService,
    private eventservice: EventService,
    private authservice: AuthService,
    private router: Router,
    private navservice: NavigationService
  ) {
    this.eventservice
      .getEvent(this.authservice.currentUserValue._id)
      .subscribe((events) => {
        this.events = events;

        this.attendanceservice.getAttendance(events).subscribe((result) => {
          this.attendanceRecords = result;
        });
      });
  }
  ngOnInit(): void {
    if (this.router.url.includes('myevents')) {
      this.currTab = 'MyEvents';
    } else {
      this.currTab = 'MyOrganization';
    }
  }

  onDateChange(event) {
    this.date = event.target.value;
  }

  enterDate() {
    this.navservice.setAttendanceDate(this.date);
  }
}
