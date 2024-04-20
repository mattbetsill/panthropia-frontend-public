import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from './notification.service';
import { formatDate } from '@angular/common';

import { AuthService } from './auth.service';
import { Event } from '../models/event';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EventService {
  constructor(private http: HttpClient, private auth: AuthService) {}

  // Gets all events based on campus name
  getAll(campusId: string, isOrg, isProfile, date) {
    return this.http.get<Event[]>(
      environment.backend + `/event/getCampusEvents`,
      {
        responseType: 'json',
        params: {
          param: campusId,
          user: this.auth.currentUserValue
            ? this.auth.currentUserValue._id
            : '000000000000',
          isOrg,
          isProfile,
          date,
        },
      }
    );
  }

  // Gets a single event based on parameters from the event
  getEvent(eventParams) {
    return this.http.get<Event>(environment.backend + `/event/getEvent`, {
      responseType: 'json',
      params: { param: eventParams },
    });
  }

  // Deletes event based on its ID
  deleteEvent(eventID) {
    return this.http.delete(environment.backend + '/event/deleteEvent', {
      params: { param: eventID },
    });
  }

  // Adds event calling router in backend
  add(event) {
    return this.http.post(environment.backend + `/event/addevent`, event);
  }

  getOneEvent(eventParams) {
    return this.http.get<Event>(environment.backend + `/event/getSingleEvent`, {
      responseType: 'json',
      params: { param: eventParams },
    });
  }

  editEvent(id, event) {
    console.log(id, event);
    return this.http.post(environment.backend + `/event/editEvent`, {
      responseType: 'json',
      params: { id, event },
    });
  }

  getPrivateOrgs(eventId) {
    return this.http.get(environment.backend + '/event/getPrivOrgNames', {
      responseType: 'json',
      params: { eventId },
    });
  }

  getQr(eventId) {
    return this.http.get(environment.backend + '/event/getQr', {
      responseType: 'json',
      params: { eventId },
    });
  }

  removeQrCode(eventId) {
    return this.http.get(environment.backend + '/event/removeQr', {
      responseType: 'json',
      params: { eventId },
    });
  }

  verifyQr(eventId, code) {
    return this.http.get(environment.backend + '/event/verifyQr', {
      responseType: 'json',
      params: { eventId, code },
    });
  }
}
