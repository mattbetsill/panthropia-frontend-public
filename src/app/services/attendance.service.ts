import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { stringify } from 'querystring';
import { environment } from './../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  constructor(private http: HttpClient) {}

  public postAttendance(record) {
    return this.http.post(
      environment.backend + '/attendance/postAttendance',
      record
    );
  }

  public getAttendance(events) {
    let ids = [];
    // tslint:disable-next-line:prefer-for-of
    if (events.length > 0) {
      for (let i = 0; i < events.length; i++) {
        ids.push(events[i]._id);
      }
    }
    return this.http.get(
      environment.backend + `/attendance/getEventAttendance`,
      { responseType: 'json', params: { param: ids } }
    );
  }

  public getOrgAttendance(org) {
    let params = new HttpParams();
    params = params.append('organization', JSON.stringify(org));

    return this.http.get(environment.backend + `/attendance/getOrgAttendance`, {
      responseType: 'json',
      params: { orgid: org },
    });
  }

  public getUserAttendance(user) {
    return this.http.get(
      environment.backend + `/attendance/getUserAttendance`,
      { responseType: 'json', params: { user: user._id } }
    );
  }

  public setUserAttendance(recordId, value, countBoth, field) {
    return this.http.get(
      environment.backend + `/attendance/setUserAttendanceStatus`,
      { responseType: 'json', params: { recordId, value, countBoth, field } }
    );
  }

  public getS3Put(fileName) {
    return this.http.get(environment.backend + `/attendance/s3PutUrl`, {
      responseType: 'json',
      params: { fileName },
    });
  }

  public gets3Get(fileName) {
    return this.http.get(environment.backend + `/attendance/s3GetUrl`, {
      responseType: 'json',
      params: { fileName },
    });
  }

  public getNonAttendees(eventid, orgid) {
    return this.http.get(environment.backend + `/attendance/getNonAttendees`, {
      responseType: 'json',
      params: { eventid, orgid },
    });
  }

  public getOrgOnlyAttendance(orgid) {
    return this.http.get(
      environment.backend + '/attendance/getOnlyOrgAttendance',
      { responseType: 'json', params: { orgid } }
    );
  }

  public deleteRecord(id) {
    return this.http.get(environment.backend + '/attendance/deleteRecord', {
      responseType: 'json',
      params: { id },
    });
  }

  public getEventAttendanceAnalysis(id) {
    return this.http.get(
      environment.backend + '/attendance/getEventAttendanceAnalysis',
      { responseType: 'json', params: { id } }
    );
  }
}
