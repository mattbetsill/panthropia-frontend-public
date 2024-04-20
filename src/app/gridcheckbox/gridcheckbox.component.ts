import { Component, OnInit } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { IAfterGuiAttachedParams } from 'ag-grid-community';
import { AttendanceService } from '../services/attendance.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-gridcheckbox',
  templateUrl: './gridcheckbox.component.html',
  styleUrls: ['./gridcheckbox.component.css'],
})
export class GridcheckboxComponent implements AgRendererComponent {
  accepted;
  rejected;
  currentPage;
  currentOrganization;
  params: any;
  constructor(
    private attendanceService: AttendanceService,
    private router: Router,
    private auth: AuthService
  ) {
    if (router.url.toString().includes('myorganization')) {
      this.currentPage = 'approvedByOrg';
    } else if (router.url.toString().includes('myevents')) {
      this.currentPage = 'approvedByEvent';
    }
    this.currentOrganization = this.auth.currentUserValue.orgref.organization;
  }

  agInit(params: any): void {
    this.accepted = false;
    this.rejected = false;
    this.params = params;
    if (params.data.Approval === 'Accepted') {
      this.accepted = true;
    }
    if (params.data.Approval === 'Rejected') {
      this.rejected = true;
    }
  }

  afterGuiAttached(params?: IAfterGuiAttachedParams): void {}

  refresh(result: any): boolean {
    let countBoth = false;

    if (
      this.currentOrganization === this.params.data.Organization &&
      this.params.data.Host === this.params.data.Organization
    ) {
      countBoth = true;
    }

    this.attendanceService
      .setUserAttendance(
        this.params.data.id,
        result,
        countBoth,
        this.currentPage
      )
      .subscribe((rec) => {
        console.log(rec);
      });

    return false;
  }
}
