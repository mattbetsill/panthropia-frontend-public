import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { CampusService } from '../services/campus.service';
import { EventService } from '../services/event.service';
import { NavigationService } from '../services/navigation.service';
import { NotificationService } from '../services/notification.service';
import {
  addHours,
  isSameDay,
  isSameMonth,
  startOfDay,
  subDays,
} from 'date-fns';
import {
  CalendarEvent,
  CalendarEventTimesChangedEventType,
  CalendarView,
} from 'angular-calendar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit {
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
  viewDate: Date = new Date();
  events = [];
  view: CalendarView = CalendarView.Month;
  activeDayIsOpen: boolean = true;
  modalData: { event: CalendarEvent<any>; action: string };
  constructor(
    private eventservice: EventService,
    private nav: NavigationService,
    private campus: CampusService,
    private notifService: NotificationService,
    private modal: NgbModal,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe((params) => {
      if (params.date) {
        this.viewDate = new Date(params.date);
      }
    });
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  ngOnInit(): void {
    this.nav.getHeaderName().subscribe((name) =>
      this.campus.getOneCampus(name).subscribe((campus: any) => {
        let orgPresent = false;
        let profilePresent = false;

        this.eventservice
          .getAll(
            campus ? campus._id : '000000000000',
            orgPresent,
            profilePresent,
            new Date()
          )
          .subscribe(
            (events: any) => {
              let calendarEvents = [];
              for (let i = 0; i < events.length; i++) {
                const calendarEvent: any = {};
                const thisEvent = events[i];

                let hours = thisEvent.endtime.split(':');
                hours = parseInt(hours[1]) / 60 + parseInt(hours[0]);

                calendarEvent.end = new Date(thisEvent.endDateTime);
                calendarEvent.start = new Date(thisEvent.dateTime);
                calendarEvent.title =
                  thisEvent.hostref.organization + ' - ' + thisEvent.eventName;
                calendarEvent.id = thisEvent._id;
                calendarEvent.color = {
                  primary: thisEvent.hostref.primarycolor,
                };
                calendarEvents.push(calendarEvent);
                console.log(calendarEvent);
              }
              this.events = calendarEvents;
            },
            (error) => {
              this.notifService.showNotif(error.toString(), 'warning');
            }
          );
      })
    );
  }
  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
    this.router.navigate(['../event'], {
      relativeTo: this.route,
      queryParams: { eventId: event.id },
    });
  }
}
