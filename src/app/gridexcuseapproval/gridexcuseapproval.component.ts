import { Component, OnInit } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { IAfterGuiAttachedParams } from 'ag-grid-community';
import { AttendanceService } from '../services/attendance.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ExcuseService } from '../services/excuse.service';

@Component({
  selector: 'app-gridexcuseapproval',
  templateUrl: './gridexcuseapproval.component.html',
  styleUrls: ['./gridexcuseapproval.component.css'],
})
export class GridexcuseapprovalComponent implements AgRendererComponent {
  accepted;
  rejected;
  currentPage;
  currentOrganization;
  params: any;
  constructor(
    private attendanceService: AttendanceService,
    private router: Router,
    private auth: AuthService,
    private excuse: ExcuseService
  ) {
    this.currentOrganization = this.auth.currentUserValue.orgref.organization;
  }

  agInit(params: any): void {
    this.accepted = false;
    this.rejected = false;
    this.params = params;
    if (params.data.approval === 'Accepted') {
      this.accepted = true;
    }
    if (params.data.approval === 'Rejected') {
      this.rejected = true;
    }
  }

  afterGuiAttached(params?: IAfterGuiAttachedParams): void {}

  refresh(result: any): boolean {
    this.excuse
      .editExcuse({ id: this.params.data.id, approval: result })
      .subscribe((rec) => {
        console.log(rec);
      });

    return false;
  }
}
