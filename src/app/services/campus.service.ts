import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user';
import { Campus } from '../models/campus';
@Injectable({
  providedIn: 'root',
})
@Injectable({
  providedIn: 'root',
})
export class CampusService {
  private currCampus$: BehaviorSubject<Campus> = new BehaviorSubject<Campus>(
    null
  );
  constructor(private http: HttpClient) {}

  public getCampuses() {
    return this.http.get(environment.backend + '/campus/getCampuses');
  }

  public setCurrentCampus(campus) {
    this.currCampus$.next(campus);
  }

  public getOneCampus(name) {
    return this.http.get(environment.backend + '/campus/getOneCampus', {
      responseType: 'json',
      params: { name },
    });
  }

  public getCurrentCampus() {
    return this.currCampus$.asObservable();
  }
}
