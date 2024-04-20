import { Component, OnInit } from '@angular/core';

import { NotificationService } from '../services/notification.service';
import { UserService } from '../services/user.service';
import { OrganizationService } from '../services/organization.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { NavigationService } from '../services/navigation.service';
import { CampusService } from '../services/campus.service';

@Component({
  selector: 'app-orglist',
  templateUrl: './orglist.component.html',
  styleUrls: ['./orglist.component.css'],
})
export class OrglistComponent implements OnInit {
  organizations;
  headerName;
  //organizations = ['Alpha Chi Omega', 'Sigma Phi Delta',
  //'Gamma Phi Beta', 'Theta Chi', 'Chi Omega'];

  constructor(
    private userservice: UserService,
    private notifService: NotificationService,
    private orgService: OrganizationService,
    private authService: AuthService,
    private router: Router,
    private navService: NavigationService,
    private campus: CampusService
  ) {
    this.headerName = this.navService.getHeaderNameValue();
  }

  ngOnInit(): void {
    this.navService.getHeaderName().subscribe((name) => {
      this.campus.getOneCampus(name).subscribe((campus: any) => {
        this.orgService
          .getOrgList(campus ? campus._id : '000000000000')
          .subscribe((list) => {
            this.organizations = list;
          });
      });
    });
  }

  modifyUrl(event) {
    this.router.navigate([], {
      queryParams: { orgid: event, featured: false },
    });
  }
}
