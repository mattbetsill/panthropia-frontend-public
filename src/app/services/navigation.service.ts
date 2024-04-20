import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavigationService implements OnInit {
  private showNav$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  private headerName$: BehaviorSubject<string> = new BehaviorSubject<string>(
    ''
  );
  private attendanceDate$: BehaviorSubject<string> =
    new BehaviorSubject<string>('');
  private origCode$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  constructor() {}

  ngOnInit() {}

  setCode(code: string) {
    this.origCode$.next(code);
  }

  removeCode() {
    this.origCode$.next('');
  }

  getCode() {
    return this.origCode$.value;
  }

  setHeaderName(name: string) {
    this.headerName$.next(name);
  }
  setAttendanceDate(date) {
    this.attendanceDate$.next(date);
  }

  getAttendanceData() {
    return this.attendanceDate$.asObservable();
  }
  public getHeaderNameValue() {
    return this.headerName$.value;
  }

  getHeaderName() {
    return this.headerName$.asObservable();
  }

  getShowNav() {
    return this.showNav$.asObservable();
  }

  setShowNav(showHide: boolean) {
    this.showNav$.next(showHide);
  }
}
