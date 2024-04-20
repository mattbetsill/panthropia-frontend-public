import { Component, OnInit } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import {
  ICellRendererParams,
  IAfterGuiAttachedParams,
} from 'ag-grid-community';

@Component({
  selector: 'app-deleteexcuse',
  templateUrl: './deleteexcuse.component.html',
  styleUrls: ['./deleteexcuse.component.css'],
})
export class DeleteexcuseComponent implements AgRendererComponent {
  deleted: boolean;
  params: any;
  constructor() {}

  agInit(params: ICellRendererParams): void {
    console.log(params);
    this.params = params;
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }

  public async invokeParentMethod() {
    console.log(this.params);
    await this.params.context.componentParent
      .showConfirmationExcuse(this.params.data.id)
      .subscribe((removed) => {
        if (removed === true) {
          this.deleted = true;
        }
      });
  }
}
