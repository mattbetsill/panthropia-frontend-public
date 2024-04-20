import { Component, OnInit } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-deleteattendance',
  templateUrl: './deleteattendance.component.html',
  styleUrls: ['./deleteattendance.component.css'],
})
export class DeleteattendanceComponent implements AgRendererComponent {
  deleted: boolean;
  params: any;
  constructor() {}

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }

  public async invokeParentMethod() {
    await this.params.context.componentParent
      .showConfirmation(this.params.data.id)
      .subscribe((deleted) => {
        if (deleted === true) {
          this.deleted = true;
        }
      });
  }
}
