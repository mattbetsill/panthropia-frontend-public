import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrgattendancegridComponent } from '../orgattendancegrid/orgattendancegrid.component';
import { NavigationService } from '../services/navigation.service';

interface OrgCount {
  org: any;
  count: number;
}
@Component({
  selector: 'app-eventdata',
  templateUrl: './eventdata.component.html',
  styleUrls: ['./eventdata.component.css'],
})
export class EventdataComponent implements OnInit {
  @Input() eventd: any;
  @Input() attendanced: any;
  orgData: OrgCount[];
  renderinfo: boolean;
  showOverlay: boolean;

  constructor(
    private navService: NavigationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
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

  navToEvent() {
    this.router.navigate(['../../event'], {
      relativeTo: this.route,
      queryParams: { eventId: this.eventd._id },
    });
  }

  navToOrg() {
    this.router.navigate(['../../organizations'], {
      relativeTo: this.route,
      queryParams: { orgid: this.eventd.hostref._id, featured: 'false' },
    });
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
