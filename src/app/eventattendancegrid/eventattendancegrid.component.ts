import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { GridcheckboxComponent } from '../gridcheckbox/gridcheckbox.component';
import { GridexcuseapprovalComponent } from '../gridexcuseapproval/gridexcuseapproval.component';
import { ProofimageComponent } from '../proofimage/proofimage.component';
import { AttendanceService } from '../services/attendance.service';
import { AuthService } from '../services/auth.service';
import { ExcuseService } from '../services/excuse.service';

@Component({
  selector: 'app-eventattendancegrid',
  templateUrl: './eventattendancegrid.component.html',
  styleUrls: ['./eventattendancegrid.component.css'],
  providers: [DatePipe],
})
export class EventattendancegridComponent implements OnInit {
  @Input() attendanced: any;
  @Input() event: any;
  @Input() host: any;
  private gridApi;
  private gridColumnApi;
  private gridApiNon;
  private gridColumnApiNon;
  private gridApiOrg;
  private gridColumnApiOrg;
  private image: any;
  toggleExcused = new FormControl(false);
  context;
  showOverlayToggle: boolean;
  columnDefs = [
    {
      field: 'Date',
      headerName: 'Date Submitted',
      sortable: true,
      filter: true,
      resizable: true,
    },
    { field: 'User', sortable: true, filter: true, resizable: true },
    { field: 'First Name', sortable: true, filter: true, resizable: true },
    { field: 'Last Name', sortable: true, filter: true, resizable: true },
    { field: 'Organization', sortable: true, filter: true, resizable: true },
    {
      field: 'Proof',
      cellRendererFramework: ProofimageComponent,
      resizable: true,
    },
    {
      field: 'qrcodescanned',
      headerName: 'QR Code Scanned',
      sortable: true,
      filter: true,
      resizable: true,
    },
    {
      field: 'groupsubmission',
      headerName: 'Submission Type',
      sortable: true,
      filter: true,
    },
    { field: 'Approval', sortable: true, filter: true, resizable: true },
    {
      field: 'Approve',
      headerName: 'Approve/Reject',
      cellRendererFramework: GridcheckboxComponent,
      resizable: true,
    },
    { field: 'id', hide: true, resizable: true },
    { field: 'Host', hide: true, resizable: true },
  ];

  nonAttendeeColumnDefs = [
    { field: 'User', sortable: true, filter: true, resizable: true },
    {
      field: 'FirstName',
      headerName: 'First Name',
      filter: true,
      resizable: true,
    },
    {
      field: 'LastName',
      headerName: 'Last Name',
      filter: true,
      resizable: true,
    },
    { field: 'excused', headerName: 'Excused', filter: true, resizable: true },
    { field: 'Organization', filter: true, resizable: true },
  ];

  excusesColumnDefs = [
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

  attendanceAnalysisColumnDefs = [
    {
      field: 'organization',
      headerName: 'Organization',
      sortable: true,
      filter: true,
      resizable: true,
    },
    {
      field: 'attendancecount',
      headerName: 'Member Submissions',
      sortable: true,
      filter: true,
      resizable: true,
    },
    {
      field: 'acceptedsubmissions',
      headerName: 'Accepted Submissions',
      sortable: true,
      filter: true,
      resizable: true,
    },
    {
      field: 'pendingsubmissions',
      headerName: 'Pending Submissions',
      sortable: true,
      filter: true,
      resizable: true,
    },
    {
      field: 'rejectedsubmissions',
      headerName: 'Rejected Submissions',
      sortable: true,
      filter: true,
    },
    {
      field: 'members',
      headerName: 'Members Attended (Pending or Accepted)',
      sortable: true,
      filter: true,
      resizable: true,
    },
    {
      field: 'totalmembers',
      headerName: 'Total Members',
      sortable: true,
      filter: true,
      resizable: true,
    },
    {
      field: 'percentage',
      headerName: 'Attendance Percentage',
      sortable: true,
      filter: true,
      resizable: true,
    },
    { field: 'campus', sortable: true, filter: true, resizable: true },
  ];

  rowData;
  nonAttendeeRowData;
  attendanceAnalysisRowData;
  excuseRowData;
  gridColumnApiExcuse: any;
  gridApiExcuse: any;
  constructor(
    private datepipe: DatePipe,
    private router: Router,
    private attendance: AttendanceService,
    private auth: AuthService,
    private excuse: ExcuseService
  ) {
    this.context = {
      componentParent: this,
    };
  }

  ngOnInit(): void {
    const records = [];
    for (let i = 0; i < this.attendanced.length; i++) {
      const attendant = this.attendanced[i];
      const record: any = {};
      record.Date = this.datepipe.transform(new Date(attendant.date), 'medium');

      record.User = attendant.userref.username;
      record['First Name'] = attendant.userref.firstname;
      record['Last Name'] = attendant.userref.lastname;
      record.Organization = attendant.userorgref.organization;
      record.Proof = attendant.proof;
      if (attendant.isgroupsubmission) {
        record.groupsubmission = 'Group';
      } else {
        record.groupsubmission = 'Individual';
      }

      if (this.router.url.includes('myorganization')) {
        record.Approval = attendant.approvedByOrg;
      } else {
        record.Approval = attendant.approvedByEvent;
      }

      record.id = attendant.id;
      record.Host = attendant.hostref.organization;

      record.qrcodescanned = attendant.qrcodescanned ? 'Yes' : 'No';

      records.push(record);
    }

    this.rowData = records;
    const nonRecords = [];

    this.attendance
      .getNonAttendees(this.event._id, this.auth.currentUserValue.orgref._id)
      .subscribe((users: any) => {
        for (let i = 0; i < users.length; i++) {
          const nonAttendant = users[i];

          const record: any = {};
          record.User = nonAttendant.username;
          record.FirstName = nonAttendant.firstname;
          record.LastName = nonAttendant.lastname;
          record.Organization = nonAttendant.orgref.organization;
          record.excused = nonAttendant.organization;

          nonRecords.push(record);
        }
        this.nonAttendeeRowData = nonRecords;
      });

    this.attendance
      .getEventAttendanceAnalysis(this.event._id)
      .subscribe((analysis: any) => {
        console.log(analysis);
        this.attendanceAnalysisRowData = analysis;
      });

    this.excuse
      .getEventExcuses(this.event._id, this.auth.currentUserValue.orgref._id)
      .subscribe((excuses: any) => {
        for (let i = 0; i < excuses.length; i++) {
          excuses[i].date = this.datepipe.transform(
            new Date(excuses[i].date),
            'medium'
          );
        }
        this.excuseRowData = excuses;
      });
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  onGridReadyNon(params) {
    this.gridApiNon = params.api;
    this.gridColumnApiNon = params.columnApi;
  }

  onGridReadyOrg(params) {
    this.gridApiOrg = params.api;
    this.gridColumnApiOrg = params.columnApi;
  }

  onGridReadyExcuse(params) {
    this.gridApiExcuse = params.api;
    this.gridColumnApiExcuse = params.columnApi;
  }

  sizeToFit() {
    this.gridApi.sizeColumnsToFit();
    this.gridApiNon.sizeColumnsToFit();
    this.gridApiOrg.sizeColumnsToFit();
    this.gridColumnApiExcuse.sizeColumnsToFit();
  }

  autoSizeAll(skipHeader) {
    const allColumnIds = [];
    this.gridColumnApi.getAllColumns().forEach((column) => {
      allColumnIds.push(column.colId);
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds, skipHeader);

    const columnIds = [];
    this.gridColumnApiNon.getAllColumns().forEach((column) => {
      columnIds.push(column.colId);
    });
    this.gridColumnApiNon.autoSizeColumns(columnIds, skipHeader);

    const columnOrgs = [];
    this.gridColumnApiOrg.getAllColumns().forEach((column) => {
      columnOrgs.push(column.colId);
    });
    this.gridColumnApiOrg.autoSizeColumns(columnOrgs, skipHeader);

    const columnExcuse = [];
    this.gridColumnApiExcuse.getAllColumns().forEach((column) => {
      columnExcuse.push(column.colId);
    });
    this.gridColumnApiOrg.autoSizeColumns(columnExcuse, skipHeader);
  }

  showOverlay(proof) {
    this.image = '';
    this.showOverlayToggle = true;
    this.attendance.gets3Get(proof).subscribe((url) => {
      this.image = url;
    });
  }

  close() {
    this.showOverlayToggle = false;
  }
}
