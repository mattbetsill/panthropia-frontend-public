import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NavigationService } from 'src/app/services/navigation.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [Location],
})
export class HeaderComponent implements OnInit {
  campusName: string;
  userName: string;
  actualUsername: string;
  initials: string;
  location: any;
  proftype: string;
  constructor(
    private navService: NavigationService,
    private router: Router,
    private authservice: AuthService,
    location: Location
  ) {
    this.actualUsername = null;
    this.location = location;
  }ß

  ngOnInit(): void {
    this.navService
      .getHeaderName()
      .subscribe((name) => (this.campusName = name));

    this.authservice.currentUser.subscribe((user) => {
      if (user && user.firstname && user.lastname) {
        this.actualUsername = user.firstname + ' ' + user.lastname;
        this.userName = user.username;
        this.initials = user.firstname[0] + user.lastname[0];
      } else if (user && user.username) {
        this.userName = user.username;
        this.initials = this.userName[0];
      } else {
        this.userName = null;
        this.actualUsername = null;
        this.initials = null;
      }
      if (user) {
        this.proftype =
          user.role.toString() === 'User' ? 'userprofile' : 'userorgprofile';
      }
    });
  }

  backButton() {
    this.location.back();
  }

  toggleSideNav() {
    this.navService.setShowNav(true);
  }
}
