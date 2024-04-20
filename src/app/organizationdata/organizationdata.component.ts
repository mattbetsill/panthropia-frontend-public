import { Component, Input, OnInit } from '@angular/core';
import { NavigationService } from '../services/navigation.service';

interface OrgCount {
  org: any;
  count: number;
}
@Component({
  selector: 'app-organizationdata',
  templateUrl: './organizationdata.component.html',
  styleUrls: ['./organizationdata.component.css'],
})
export class OrganizationdataComponent implements OnInit {
  @Input() eventd: any;
  @Input() attendanced: any;
  orgData: OrgCount[];
  renderinfo: boolean;
  showOverlay: boolean;

  constructor(private navService: NavigationService) {
    this.orgData = [];
    this.renderinfo = false;
    this.showOverlay = false;
  }

  ngOnInit(): void {
    if (this.attendanced) {
      const orgs = [
        ...new Set(this.attendanced.map((x) => x.userorgref.organization)),
      ];

      for (let i = 0; i < orgs.length; i++) {
        this.orgData[i] = {
          org: orgs[i],
          count: this.attendanced.filter(
            (x) => x.userorgref.organization === orgs[i]
          ).length,
        };
      }
    }

    console.log(this.orgData);
  }

  toggleInfo() {
    this.renderinfo = !this.renderinfo;
  }

  toggleText() {
    return this.renderinfo ? 'show less ▲' : 'show more ▼';
  }

  open() {
    this.showOverlay = true;
  }
  close() {
    this.showOverlay = false;
  }
}
