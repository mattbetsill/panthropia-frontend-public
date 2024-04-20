import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AttendanceService } from '../services/attendance.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import { ProofimageComponent } from '../proofimage/proofimage.component';
import { GridcheckboxComponent } from '../gridcheckbox/gridcheckbox.component';
import { DeleteattendanceComponent } from '../deleteattendance/deleteattendance.component';
import { DeletememberComponent } from '../deletemember/deletemember.component';
import { UserService } from '../services/user.service';
import { DeleteexcuseComponent } from '../deleteexcuse/deleteexcuse.component';
import { ExcuseService } from '../services/excuse.service';
@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css'],
  providers: [DatePipe],
})
export class UserprofileComponent implements OnInit {
  excuseId;
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
  allTimeToggleExcuses = false;
  showConfirmationExcuseToggle = false;
  deletedExcuseSubject: BehaviorSubject<boolean>;
  memberId: string;
  gridApiExcuses: any;
  gridColumnApiExcuses: any;
  // ag-grid
  selectedDefs = [];
  columnDefs = [
    { field: 'Date', sortable: true, filter: true, resizable: true },
    { field: 'Event', sortable: true, filter: true, resizable: true },
    { field: 'Host', sortable: true, filter: true },
    { field: 'Campus', sortable: true, filter: true },
    {
      field: 'Proof',
      cellRendererFramework: ProofimageComponent,
      filter: true,
    },
    {
      field: 'groupsubmission',
      headerName: 'Submission Type',
      sortable: true,
      filter: true,
    },
    {
      field: 'approvedByOrg',
      headerName: 'Status (Your Organization)',
      sortable: true,
      filter: true,
    },
    {
      field: 'approvedByEvent',
      headerName: 'Status (Event Host)',
      sortable: true,
      filter: true,
    },
    { field: 'Delete', cellRendererFramework: DeleteattendanceComponent },

    { field: 'id', hide: true },
  ];

  columnDefsExcuses = [
    { field: 'Date', sortable: true, filter: true, resizable: true },
    { field: 'Event', sortable: true, filter: true, resizable: true },
    { field: 'Host', sortable: true, filter: true, resizable: true },
    { field: 'Note', resizable: true },
    { field: 'Approval', sortable: true, resizable: true, filter: true },
    { field: 'Delete', cellRendererFramework: DeleteexcuseComponent },
    { field: 'id', hide: true },
  ];

  rowData;

  rowDataExcuses;

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
    this.deletedExcuseSubject = new BehaviorSubject<boolean>(false);
    this.showConfirmationToggle = false;
    this.currentUser = this.auth.currentUserValue;

    this.selectedDefs = this.columnDefs;
    this.attendance
      .getUserAttendance(this.currentUser)
      .subscribe((records: any[]) => {
        const tempRecs = records;
        for (let i = 0; i < tempRecs.length; i++) {
          tempRecs[i].Date = this.datepipe.transform(
            new Date(records[i].Date),
            'medium'
          );
        }

        this.rowData = tempRecs;
      });
    this.excuse
      .getUserExcuses(this.currentUser._id)
      .subscribe((records: any[]) => {
        for (let i = 0; i < records.length; i++) {
          records[i].Date = this.datepipe.transform(
            new Date(records[i].Date),
            'medium'
          );
        }
        this.rowDataExcuses = records;
        console.log(records);
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

  onGridReadyExcuses(params) {
    this.gridApiExcuses = params.api;
    this.gridColumnApiExcuses = params.columnApi;
  }

  setAllTime(value) {
    this.allTimeToggle = value;
  }
  setAllTimeExcuses(value) {
    this.allTimeToggleExcuses = value;
  }

  setMember(value) {
    this.memberToggle = value;
  }

  sizeToFit() {
    this.gridApi.sizeColumnsToFit();
  }

  sizeToFitExcuses() {
    this.gridApiExcuses.sizeColumnsToFit();
  }

  autoSizeAll(skipHeader) {
    const allColumnIds = [];
    this.gridColumnApi.getAllColumns().forEach((column) => {
      allColumnIds.push(column.colId);
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds, skipHeader);
  }

  autoSizeAllExcuses(skipHeader) {
    const allColumnIds = [];
    this.gridColumnApiExcuses.getAllColumns().forEach((column) => {
      allColumnIds.push(column.colId);
    });
    this.gridColumnApiExcuses.autoSizeColumns(allColumnIds, skipHeader);
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

  showConfirmationExcuse(id) {
    this.showConfirmationExcuseToggle = true;
    this.excuseId = id;
    return this.deletedExcuseSubject.asObservable();
  }

  closeConfirm() {
    this.showConfirmationToggle = false;
  }

  closeConfirmExcuse() {
    this.showConfirmationExcuseToggle = false;
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

  async deleteExcuse() {
    if (this.excuseId) {
      await this.excuse.deleteExcuse(this.excuseId).subscribe((res) => res);
      this.showConfirmationExcuseToggle = false;
      this.deletedExcuseSubject.next(true);
    } else {
      this.deletedExcuseSubject.next(false);
    }
    this.deletedExcuseSubject.next(false);
  }
}
