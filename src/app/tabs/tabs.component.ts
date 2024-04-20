import { Component, HostListener, Input, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { Role } from '../models/role';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css'],
})
export class TabsComponent implements OnInit {
  @Input() default: string;
  currentUser: User;
  rOrg: Role.admin;
  rUser: Role.user;
  selected: string;
  constructor(
    private authservice: AuthService,
    private router: Router,
    private activeroute: ActivatedRoute
  ) {
    this.rOrg = Role.admin;
    this.rUser = Role.user;
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    this.selected = null;
    setTimeout(() => this.determineTab(), 10);
  }

  determineTab() {
    const url = this.router.url;

    if (url.includes('attendancedata')) {
      this.selected = 'AttendanceData';
    } else if (url.includes('createevent')) {
      this.selected = 'CreateEvent';
    } else if (url.includes('organizations')) {
      this.selected = 'Organizations';
    } else if (url.includes('timeline')) {
      this.selected = 'Timeline';
    } else if (url.includes('profile')) {
      this.selected = 'Profile';
    } else {
    }
  }
  ngOnInit(): void {
    this.determineTab();

    this.authservice.currentUserValueObservable.subscribe(
      (user) => (this.currentUser = user)
    );
    this.router.events.subscribe((event) => {
      this.determineTab();
    });
  }
}
