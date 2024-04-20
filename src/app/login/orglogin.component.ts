import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';
import { NavigationService } from '../services/navigation.service';
import { UserService } from '../services/user.service';
import { HttpParams } from '@angular/common/http';
import { EventService } from '../services/event.service';
@Component({
  selector: 'app-orglogin',
  templateUrl: './orglogin.component.html',
  styleUrls: ['./orglogin.component.css'],
})
export class OrgloginComponent implements OnInit {
  loading = false;
  submitted = false;
  error = '';
  username: string;
  password: string;
  code: string;
  id: string;
  constructor(
    // private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private notif: NotificationService,
    private nav: NavigationService,
    private userservice: UserService,
    private route: ActivatedRoute,
    private eventservice: EventService
  ) {
    // redirect to home if already logged in
    // if (this.authService.currentUserValue) {
    //   //   this.router.navigate(['/']);
    // }
  }

  ngOnInit(): void {
    this.nav.setShowNav(false);
    let currentUser = this.authService.currentUserValue;
    this.route.queryParams.subscribe((params) => {
      if (currentUser && params.code) {
        this.nav.setCode(params.code);
        this.eventservice
          .verifyQr(params.id, params.code)
          .subscribe((result: any) => {
            console.log(result);
            if (result) {
              this.router.navigate(
                [
                  '../campus/' +
                    currentUser.campusref.name +
                    '/attendancesubmission',
                ],
                {
                  relativeTo: this.route,
                  queryParams: { code: params.code, id: params.id },
                }
              );
            } else {
              this.notif.showNotif('Incorrect Code!');
              return;
            }
          });
      }
      if (params.code && !currentUser) {
        this.nav.setCode(params.code);
        this.code = params.code;
        this.id = params.id;
      }
    });
  }

  login() {
    this.submitted = true;

    // stop here if form is invalid
    // if (this.loginForm.invalid) {
    //   return;
    // }

    this.loading = true;

    //this.userservice.login(this.username, this.password);

    this.authService
      .login(this.username.toLowerCase(), this.password)
      .pipe(first())
      .subscribe(
        (data) => {
          if (this.code) {
            this.route.queryParams.subscribe((params) => {
              console.log(params);
              this.router.navigate(
                ['../campus/' + data.campusref.name + '/attendancesubmission'],
                {
                  relativeTo: this.route,
                  queryParams: { code: params.code, id: this.id },
                }
              );
              this.notif.showNotif(
                'Logged in as: ' + this.username.toLowerCase,
                'confirmation'
              );
            });
          } else {
            this.router.navigate([
              'campus/' + data.campusref.name + '/timeline',
            ]);
            this.notif.showNotif(
              'Logged in as: ' + this.username,
              'confirmation'
            );
          }
        },
        (error) => {
          this.error = error;
          this.loading = false;
          // show a snackbar to user
          this.notif.showNotif(this.error, 'dismiss');
          console.log('Error', error);
        }
      );
  }

  register() {}
}
