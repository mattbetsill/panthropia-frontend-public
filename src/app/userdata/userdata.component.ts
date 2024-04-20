import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-userdata',
  templateUrl: './userdata.component.html',
  styleUrls: ['./userdata.component.css'],
})
export class UserdataComponent implements OnInit {
  @Input() attendant: any;
  showOverlay: boolean;
  constructor() {
    this.showOverlay = false;
  }

  ngOnInit(): void {}

  open() {
    this.showOverlay = true;
  }
  close() {
    this.showOverlay = false;
  }
}
