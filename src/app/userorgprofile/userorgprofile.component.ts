import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DeleteattendanceComponent } from '../deleteattendance/deleteattendance.component';
import { DeletememberComponent } from '../deletemember/deletemember.component';
import { GridexcuseapprovalComponent } from '../gridexcuseapproval/gridexcuseapproval.component';
import { ProofimageComponent } from '../proofimage/proofimage.component';
import { AttendanceService } from '../services/attendance.service';
import { AuthService } from '../services/auth.service';
import { ExcuseService } from '../services/excuse.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-userorgprofile',
  templateUrl: './userorgprofile.component.html',
  styleUrls: ['./userorgprofile.component.css'],
  providers: [DatePipe],
})
export class UserorgprofileComponent implements OnInit {
  currentUser;
  attendanceRecords;
  private gridApi;
  private gridColumnApi;
  context;
  showOverlayToggle: boolean;
  image: any;
  showConfirmationToggle: boolean;
  attendanceId: string;
  private deletedSubject: BehaviorSubject<boolean>;
  changeLink;
  allTimeToggle = false;
  memberToggle = false;
  showConfirmationMemberToggle = false;
  excuseToggle = false;
  deletedMemberSubject: BehaviorSubject<boolean>;
  memberId: string;
  // ag-grid
  selectedDefs = [];
  private gridApiOrg;
  private gridColumnApiOrg;
  private gridApiOrgExcuses;
  private gridColumnApiOrgExcuses;
  columnDefsOrg = [
    {
      field: 'Date',
      headerName: 'Date Submitted',
      sortable: true,
      filter: true,
    },
    { field: 'Event', sortable: true, filter: true, resizable: true },
    { field: 'Host', sortable: true, filter: true, resizable: true },
    { field: 'FirstName', sortable: true, filter: true, resizable: true },
    { field: 'LastName', sortable: true, filter: true, resizable: true },
    {
      field: 'Proof',
      cellRendererFramework: ProofimageComponent,
      resizable: true,
    },
    {
      field: 'groupsubmission',
      headerName: 'Submission Type',
      sortable: true,
      filter: true,
    },
    { field: 'OrgStatus', sortable: true, filter: true, resizable: true },
    { field: 'EventStatus', sortable: true, filter: true, resizable: true },
  ];

  columnDefsOrgMembers = [
    {
      field: 'firstname',
      headerName: 'First Name',
      sortable: true,
      filter: true,
    },
    {
      field: 'lastname',
      headerName: 'Last Name',
      sortable: true,
      filter: true,
    },
    { field: 'username', headerName: 'Username', sortable: true, filter: true },
    {
      field: 'remove',
      headerName: 'Remove Member',
      cellRendererFramework: DeletememberComponent,
    },
    { field: 'id', hide: true },
  ];

  columnDefsOrgExcuses = [
    {
      field: 'date',
      headerName: 'Date Submitted',
      sortable: true,
      filter: true,
      resizable: true,
    },
    {
      field: 'firstname',
      headerName: 'First Name',
      filter: true,
      sortable: true,
      resizable: true,
    },
    {
      field: 'lastname',
      headerName: 'Last Name',
      filter: true,
      sortable: true,
      resizable: true,
    },
    {
      field: 'event',
      headerName: 'Event',
      filter: true,
      sortable: true,
      resizable: true,
    },
    {
      field: 'host',
      headerName: 'Host',
      filter: true,
      sortable: true,
      resizable: true,
    },
    {
      field: 'info',
      headerName: 'Note',
      filter: true,
      sortable: true,
      resizable: true,
    },
    {
      field: 'approval',
      headerName: 'Approval',
      filter: true,
      sortable: true,
      resizable: true,
    },
    {
      field: 'approve',
      headerName: 'Approve/Reject',
      cellRendererFramework: GridexcuseapprovalComponent,
    },
    { field: 'id', hide: true },
  ];

  rowData;
  orgMemData;
  excuseData;

  constructor(
    private auth: AuthService,
    private attendance: AttendanceService,
    private datepipe: DatePipe,
    private userservice: UserService,
    private excuse: ExcuseService
  ) {
    this.changeLink =
      'mailto:matthewb22@vt.edu?subject=Panthropia Request: Organization Name Change&body=Please provide your campus and current organization name. I will try to get it updated asap!';
    this.deletedSubject = new BehaviorSubject<boolean>(false);
    this.deletedMemberSubject = new BehaviorSubject<boolean>(false);
    this.showConfirmationToggle = false;
    this.currentUser = this.auth.currentUserValue;

    this.selectedDefs = this.columnDefsOrg;
    this.attendance
      .getOrgOnlyAttendance(
        this.currentUser.orgref ? this.currentUser.orgref._id : '000000000000'
      )
      .subscribe((data: any) => {
        for (let i = 0; i < data.length; i++) {
          data[i].Date = this.datepipe.transform(
            new Date(
              (typeof data[i].Date === 'string'
                ? new Date(data[i].Date)
                : data[i].Date
              ).toLocaleString('en-US', { timeZone: 'America/New_York' })
            ),
            'medium'
          );
        }
        this.rowData = data;
      });

    this.userservice
      .getOrgMembers(
        this.currentUser.orgref ? this.currentUser.orgref._id : '000000000000'
      )
      .subscribe((orgs) => {
        this.orgMemData = orgs;
      });

    this.excuse
      .getOrgExcuses(
        this.currentUser.orgref ? this.currentUser.orgref._id : '000000000000'
      )
      .subscribe((excuses: any) => {
        for (let i = 0; i < excuses.length; i++) {
          excuses[i].date = this.datepipe.transform(
            new Date(excuses[i].date),
            'medium'
          );
        }
        this.excuseData = excuses;
      });

    this.context = {
      componentParent: this,
    };
  }

  ngOnInit(): void {}
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }
  onGridReadyOrg(params) {
    this.gridApiOrg = params.api;
    this.gridColumnApiOrg = params.columnApi;
  }

  onGridReadyOrgExcuses(params) {
    this.gridApiOrgExcuses = params.api;
    this.gridColumnApiOrgExcuses = params.columnApi;
  }
  sizeToFitOrg() {
    this.gridApiOrg.sizeColumnsToFit();
  }
  sizeToFitOrgExcuses() {
    this.gridApiOrgExcuses.sizeColumnsToFit();
  }
  setAllTime(value) {
    this.allTimeToggle = value;
  }

  setMember(value) {
    this.memberToggle = value;
  }

  setExcuse(value) {
    this.excuseToggle = value;
  }

  sizeToFit() {
    this.gridApi.sizeColumnsToFit();
  }

  autoSizeAll(skipHeader) {
    const allColumnIds = [];
    this.gridColumnApi.getAllColumns().forEach((column) => {
      allColumnIds.push(column.colId);
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds, skipHeader);
  }

  autoSizeAllOrg(skipHeader) {
    const columnOrgs = [];
    this.gridColumnApiOrg.getAllColumns().forEach((column) => {
      columnOrgs.push(column.colId);
    });
    this.gridColumnApiOrg.autoSizeColumns(columnOrgs, skipHeader);
  }

  autoSizeAllOrgExcuses(skipHeader) {
    const columnOrgs = [];
    this.gridColumnApiOrgExcuses.getAllColumns().forEach((column) => {
      columnOrgs.push(column.colId);
    });
    this.gridColumnApiOrgExcuses.autoSizeColumns(columnOrgs, skipHeader);
  }

  showOverlay(proof) {
    this.showOverlayToggle = true;
    this.image = '';
    this.attendance.gets3Get(proof).subscribe((url) => {
      this.image = url;
    });
  }

  close() {
    this.showOverlayToggle = false;
  }

  showConfirmation(id) {
    this.showConfirmationToggle = true;
    this.attendanceId = id;
    return this.deletedSubject.asObservable();
  }

  showConfirmationMember(id) {
    this.showConfirmationMemberToggle = true;
    this.memberId = id;
    console.log(id);
    return this.deletedMemberSubject.asObservable();
  }

  closeConfirm() {
    this.showConfirmationToggle = false;
  }

  closeConfirmMember() {
    this.showConfirmationMemberToggle = false;
  }

  async removeMember() {
    if (this.memberId) {
      await this.userservice
        .setIndependent(this.memberId)
        .subscribe((res) => res);
      this.showConfirmationMemberToggle = false;
      this.deletedMemberSubject.next(true);
    } else {
      this.deletedMemberSubject.next(false);
    }
    this.deletedMemberSubject.next(false);
  }

  async deleteAttendance() {
    if (this.attendanceId) {
      await this.attendance
        .deleteRecord(this.attendanceId)
        .subscribe((res) => res);
      this.showConfirmationToggle = false;
      this.deletedSubject.next(true);
    } else {
      this.deletedSubject.next(false);
    }
    this.deletedSubject.next(false);
  }
}
