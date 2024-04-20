import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrganizationService } from '../services/organization.service';
import { NavigationService } from '../services/navigation.service';
import { Organization } from '../models/organization';
import { NotificationService } from '../services/notification.service';
import { AttendanceService } from '../services/attendance.service';
import { CampusService } from '../services/campus.service';

@Component({
  selector: 'app-individualorg',
  templateUrl: './individualorg.component.html',
  styleUrls: ['./individualorg.component.css'],
})
export class IndividualorgComponent implements OnInit {
  renderFeatured: boolean;
  currentOrg = null;
  showOverlay = false;
  constructor(
    private route: ActivatedRoute,
    private orgservice: OrganizationService,
    private navservice: NavigationService,
    private notif: NotificationService,
    private attendance: AttendanceService,
    private campus: CampusService
  ) {
    this.renderFeatured = true;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.renderFeatured = !params.featured;
      this.orgservice
        .getOrg(params.orgid ? params.orgid : '000000000000')
        .subscribe(
          (org: any) => {
            if (org && org.image !== null) {
              this.attendance.gets3Get(org.image).subscribe((url: any) => {
                this.currentOrg.image = url;
              });
            }

            this.currentOrg = org;
            if (this.currentOrg === null) {
              // tslint:disable-next-line:no-shadowed-variable
              this.campus
                .getOneCampus(this.navservice.getHeaderNameValue())
                .subscribe((campus: any) => {
                  this.orgservice.getFeaturedOrg(campus._id).subscribe(
                    (organ: any) => {
                      this.currentOrg = organ;
                      if (organ && organ.image !== null) {
                        this.attendance
                          .gets3Get(organ.image)
                          .subscribe((url: any) => {
                            this.currentOrg.image = url;
                          });
                      }
                    },
                    (error) => console.log(error)
                  );
                });
            }
          },
          (error) => console.log(error)
        );
    });
  }

  toggleFeatured() {
    this.renderFeatured = false;
  }

  open() {
    this.showOverlay = true;
  }
  close() {
    this.showOverlay = false;
  }
}
