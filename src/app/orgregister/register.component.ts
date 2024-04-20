import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { NotificationService } from '../services/notification.service';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/role';
import { NavigationService } from '../services/navigation.service';
import { CampusService } from '../services/campus.service';
import { Campus } from '../models/campus';

@Component({
  templateUrl: 'register.component.html',

  styleUrls: ['register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  campuses = [];
  showWarning = false;
  campusid;

  constructor(
    private formBuilder: FormBuilder,
    private nav: NavigationService,
    private notification: NotificationService,
    private userService: UserService,
    private campusservice: CampusService,
    private router: Router
  ) {
    this.campusid = '';
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      campus: ['', [Validators.required]],
      organization: ['', [Validators.required]],
      role: [Role.admin],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.pattern('^[a-z0-9]+$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      authkey: ['', [Validators.required]],
      campusref: [''],
    });

    this.campusservice.getCampuses().subscribe((campuses: Campus[]) => {
      this.campuses = campuses;
    });
    this.nav.setShowNav(false);
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  showWarningToggle() {
    this.showWarning = true;
  }

  selectedCampus(campus) {
    this.campusid = campus._id;
  }

  verify(key) {
    if (key === 'org_0182') {
      return false;
    } else {
      return true;
    }
  }

  emailKey() {
    window.location.href =
      'mailto:matthewb22@vt.edu?subject=Panthropia Organization Key Request&body=Please ' +
      'state your organization and provide some sort of verification that you are an executive member or administrator.\n\n ' +
      'You will recieve an email back shortly with your Authorization Key to create your account!';
  }

  onSubmit() {
    console.log(this.registerForm.value);
    this.submitted = true;
    // stop here if form is invalid
    console.log(this.registerForm.value.authkey);

    if (
      this.registerForm.invalid ||
      this.verify(this.registerForm.value.authkey)
    ) {
      this.notification.showNotif('Registration Unsuccessful');
      return;
    }
    this.registerForm.patchValue({
      email: this.registerForm.value.email.toString().toLowercase(),
    });

    this.registerForm.patchValue({
      campusref: this.campusid,
    });

    this.loading = true;
    console.log(this.registerForm.value);
    // this.userservice.addOrg(this.registerForm.value);
    // this.router.navigateByUrl('login');
    // this.notif.showNotif('Registration successful', 'confirm');

    this.userService
      .register(this.registerForm.value)
      .pipe(first())
      .subscribe(
        (data) => {
          //  this.alertService.success('Registration successful', true);
          this.router.navigate(['/login']);
          this.notification.showNotif('successfully registered', 'success');
        },
        (error) => {
          console.log('Error:', error);
          this.notification.showNotif(error);
          this.loading = false;
        }
      );
  }
}
