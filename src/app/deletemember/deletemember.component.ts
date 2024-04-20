import { Component, OnInit } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import {
  ICellRendererParams,
  IAfterGuiAttachedParams,
} from 'ag-grid-community';

@Component({
  selector: 'app-deletemember',
  templateUrl: './deletemember.component.html',
  styleUrls: ['./deletemember.component.css'],
})
export class DeletememberComponent implements AgRendererComponent {
  removed: boolean;
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
      .showConfirmationMember(this.params.data.id)
      .subscribe((removed) => {
        if (removed === true) {
          this.removed = true;
        }
      });
  }
}
