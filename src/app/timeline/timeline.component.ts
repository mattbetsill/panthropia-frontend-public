import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { Event } from '../models/event';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../services/event.service';
import { NotificationService } from '../services/notification.service';

import { NavigationService } from '../services/navigation.service';
import { first } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { CampusService } from '../services/campus.service';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css'],
})
export class TimelineComponent implements OnInit {
  @Input() organization!: any;
  @Input() profile!: boolean;

  isTimelinePage: boolean;
  defaultTab: string;
  eventsArr: Event[];
  Organizations: any;
  toggleNoEvents = false;
  changeCount = 0;
  // exampleEvent = [{
  //   starttime: '17:00',
  //   endtime: '21:00',
  //   eventName: 'Welome to Panthropia! This is a platform for all Greek Life and collegiate organization events. ' +
  //     'Hit the see more button for more information!',
  //   flyer: '',
  //   info: 'This is where you will find all the information regarding the event that the event organizer deems necessary. To the right, ' +
  //     'the submit attendance button allows you to submit a picture proving you were at the event. The organization that hosts the event and the organization you signed up with ' +
  //     'will be able to see your attendance, if not signed up as an independent. ' +
  //     'Hit your profile icon in the top right to see all the attendance you have submitted and whether or not the attendance was approved!',
  //   host: 'Host Organization (click me)',
  //   charity: null,
  //   date: null,
  //   campus: null,
  //   createdBy: null,
  //   _id: null,
  //   uniqueDate: null,
  //   privateEvent: null,
  //   privateOrganizations: null,
  //   dateTime: null,
  //   archived: false,
  //   eventType: 'Philanthropy, Rush, Other',
  //   campusref:
  //
  //
  // }];

  constructor(
    private eventservice: EventService,
    private nav: NavigationService,
    private notifService: NotificationService,
    private auth: AuthService,
    private campus: CampusService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (this.router.url.includes('timeline') && !this.auth.currentUserValue) {
      this.isTimelinePage = true;
    }
    console.log(changes);
    this.eventsArr = null;
    if (this.organization !== null && this.profile !== null) {
      this.loadEvents();
    }
  }

  ngOnInit(): void {
    this.defaultTab = 'Organizations';

    this.loadEvents();

    // console.log(this.events);
  }

  deleteEvent(event) {
    this.eventservice
      .deleteEvent(event._id)
      .pipe(first())
      .subscribe(() => {
        this.eventsArr = null;

        this.loadEvents();
      });
  }

  calendarnav(date) {
    this.router.navigate(['../calendar'], {
      relativeTo: this.route,
      queryParams: { date },
    });
  }

  private loadEvents() {
    this.nav.getHeaderName().subscribe((name) =>
      this.campus.getOneCampus(name).subscribe((campus: any) => {
        let orgPresent = false;
        let profilePresent = false;
        if (this.organization && this.organization._id) {
          orgPresent = this.organization._id;
        }
        if (this.profile) {
          profilePresent = true;
        }

        this.eventservice
          .getAll(
            campus ? campus._id : '000000000000',
            orgPresent,
            profilePresent,
            new Date()
          )
          .subscribe(
            (events) => {
              if (
                this.auth.currentUserValue &&
                !this.auth.currentUserValue.orgref &&
                this.profile
              ) {
                events = [];
              }

              if (events.length > 0) {
                events = this.setUniqueDates(events);
              }
              if (!this.organization) {
                //this.events = this.exampleEvent.concat(this.events);
              }
              if (events.length === 0) {
                this.toggleNoEvents = true;
              } else {
                this.toggleNoEvents = false;
              }
              this.eventsArr = events;
            },
            (error) => {
              this.notifService.showNotif(error.toString(), 'warning');
            }
          );
      })
    );
  }

  setUniqueDates(eventList): [] {
    const newList = eventList;
    let lastDate = eventList[0].date;
    eventList[0].uniqueDate = true;
    for (let i = 1; i < eventList.length; i++) {
      if (eventList[i].date === lastDate) {
        eventList[i].uniqueDate = false;
      } else {
        eventList[i].uniqueDate = true;
      }
      lastDate = eventList[i].date;
    }

    return newList;
  }

  isDateTomorrow(date) {
    let date1 = new Date();
    let date2 = new Date(date);
    var date1_tomorrow = new Date(
      date1.getFullYear(),
      date1.getMonth(),
      date1.getDate() + 1
    );
    if (
      date1_tomorrow.getFullYear() == date2.getFullYear() &&
      date1_tomorrow.getMonth() == date2.getMonth() &&
      date1_tomorrow.getDate() == date2.getDate()
    ) {
      return true; // date2 is one day after date1.
    }
  }

  isDateToday(date) {
    let date1 = new Date();
    let date2 = new Date(date);
    var date1_tomorrow = new Date(
      date1.getFullYear(),
      date1.getMonth(),
      date1.getDate()
    );
    if (
      date1_tomorrow.getFullYear() == date2.getFullYear() &&
      date1_tomorrow.getMonth() == date2.getMonth() &&
      date1_tomorrow.getDate() == date2.getDate()
    ) {
      return true; // date2 is one day after date1.
    }
  }

  isDateDayAfterTomorrow(date) {
    let date1 = new Date();
    let date2 = new Date(date);
    var date1_tomorrow = new Date(
      date1.getFullYear(),
      date1.getMonth(),
      date1.getDate() + 2
    );
    if (
      date1_tomorrow.getFullYear() == date2.getFullYear() &&
      date1_tomorrow.getMonth() == date2.getMonth() &&
      date1_tomorrow.getDate() == date2.getDate()
    ) {
      return true; // date2 is one day after date1.
    }
  }
}
