import { Component, Input, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { GridcheckboxComponent } from '../gridcheckbox/gridcheckbox.component';
import { Router } from '@angular/router';
import { ProofimageComponent } from '../proofimage/proofimage.component';
import { AttendanceService } from '../services/attendance.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-orgattendancegrid',
  templateUrl: './orgattendancegrid.component.html',
  styleUrls: ['./orgattendancegrid.component.css'],
  providers: [DatePipe],
})
export class OrgattendancegridComponent implements OnInit {
  @Input() attendanced: any;
  @Input() event: any;
  @Input() host: any;
  private gridApi;
  private gridColumnApi;
  private gridApiNon;
  private gridColumnApiNon;
  private image: any;
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
      field: 'Approve/Reject',
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
    { field: 'Organization', filter: true, resizable: true },
  ];

  rowData;
  nonAttendeeRowData;
  constructor(
    private datepipe: DatePipe,
    private router: Router,
    private attendance: AttendanceService,
    private auth: AuthService
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
      record.Date = this.datepipe.transform(
        new Date(
          (typeof attendant.date === 'string'
            ? new Date(attendant.date)
            : attendant.date
          ).toLocaleString('en-US', { timeZone: 'America/New_York' })
        ),
        'medium'
      );

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
          nonRecords.push(record);
        }
        this.nonAttendeeRowData = nonRecords;
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

  sizeToFit() {
    this.gridApi.sizeColumnsToFit();
    this.gridApiNon.sizeColumnsToFit();
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
  }

  showOverlay(proof) {
    this.image = '';
    this.showOverlayToggle = true;
    console.log(proof);
    this.attendance.gets3Get(proof).subscribe((url) => {
      this.image = url;
    });
  }

  close() {
    this.showOverlayToggle = false;
  }
}
