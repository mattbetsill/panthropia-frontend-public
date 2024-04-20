import { Component, OnInit } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-proofimage',
  templateUrl: './proofimage.component.html',
  styleUrls: ['./proofimage.component.css'],
})
export class ProofimageComponent implements AgRendererComponent {
  public params: any;
  renderproof = false;
  constructor() {}

  ngOnInit(): void {}

  agInit(params: ICellRendererParams): void {
    if (params.data.Proof) {
      this.renderproof = true;
    }
    this.params = params;
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }

  public invokeParentMethod() {
    this.params.context.componentParent.showOverlay(this.params.data.Proof);
  }
}
