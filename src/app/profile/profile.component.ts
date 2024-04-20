import { Component, OnInit } from '@angular/core';
import { OrganizationService } from '../services/organization.service';
import { AuthService } from '../services/auth.service';
import { Organization } from '../models/organization';
import { AttendanceService } from '../services/attendance.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  thisorganization;
  showOverlay = false;
  constructor(
    private orgservice: OrganizationService,
    private authservice: AuthService,
    private attendance: AttendanceService
  ) {
    this.thisorganization = new Organization();
  }

  ngOnInit(): void {
    this.orgservice
      .getOrg(
        this.authservice.currentUserValue.orgref
          ? this.authservice.currentUserValue.orgref._id
          : '000000000000'
      )
      .subscribe((res) => {
        this.thisorganization = res;
        if (!res) {
          this.thisorganization = new Organization();
          this.thisorganization.organization =
            'Edit your profile to add your organization to the organizations tab';
          this.thisorganization.image = null;
          this.thisorganization.charity = 'charity placeholder';
          this.thisorganization.bio = 'bio placeholder';
        } else {
          if (this.thisorganization.image !== null) {
            this.attendance
              .gets3Get(this.thisorganization.image)
              .subscribe((url: any) => {
                this.thisorganization.image = url;
              });
          }
        }
      });
  }

  open() {
    this.showOverlay = true;
  }
  close() {
    this.showOverlay = false;
  }
}
