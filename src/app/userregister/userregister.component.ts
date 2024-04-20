import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationService } from '../services/navigation.service';

import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';
import { CampusService } from '../services/campus.service';
import { first } from 'rxjs/operators';
import { Role } from '../models/role';
import { OrganizationService } from '../services/organization.service';
import { Campus } from '../models/campus';

@Component({
  selector: 'app-userregister',
  templateUrl: './userregister.component.html',
  styleUrls: ['./userregister.component.css'],
})
export class UserregisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  roles = [];
  campuses: any;
  selectedCampusId: string;
  organizations: any;
  toggleOrgs: boolean;
  selectedOrgId;
  selectedCampus;
  toggleOrgPasscode = false;
  constructor(
    // private patternValidator: PatternValidator,
    private formBuilder: FormBuilder,
    private router: Router,

    private nav: NavigationService,
    private notification: NotificationService,
    private campusservice: CampusService,
    private userservice: UserService,
    private orgservice: OrganizationService
  ) {
    // redirect to home if already logged in
    this.selectedCampusId = '';
    this.selectedOrgId = '';
    this.selectedCampus = '';
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      role: [Role.user],
      campus: ['', [Validators.required]],
      organization: ['', [Validators.required]],
      firstname: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-Z.-]+$')],
      ],
      lastname: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-Z.-]+$')],
      ],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.pattern('^[a-z0-9]+$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passkey: [''],
      campusref: [''],
      orgref: [''],
    });
    this.nav.setShowNav(false);
    this.campusservice.getCampuses().subscribe((campuses: Campus[]) => {
      this.campuses = campuses;
    });
    this.organizations = [{ organization: 'Select a campus first!' }];
  }

  orgsOpened() {
    this.toggleOrgs = true;
  }

  campusChanged(selCampus) {
    const campus = selCampus.name;

    this.selectedCampusId = selCampus._id;
    this.orgservice
      .getOrgList(this.selectedCampusId)
      .subscribe((result: any) => {
        result.push({
          organization: 'Independent',
          _id: '6121cacad2fa956e04154965',
        });
        console.log(result);
        result.sort((a, b) => {
          if (a.organization.toLowerCase() < b.organization.toLowerCase()) {
            return -1;
          } else {
            return 1;
          }
        });
        this.organizations = result;
      });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  selectedOrganization(org) {
    this.selectedOrgId = org._id;
    if (org.isprivate) {
      this.toggleOrgPasscode = true;
    } else {
      this.toggleOrgPasscode = false;
    }
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid

    console.log(this.registerForm.value);
    if (this.registerForm.invalid) {
      console.log('Error in onSubmit()');
      return;
    }
    this.registerForm.patchValue({
      campusref: this.selectedCampusId,
    });

    if (this.selectedOrgId !== '') {
      this.registerForm.patchValue({
        orgref: this.selectedOrgId,
      });
    }
    // this.userservice.addUser(this.registerForm.value);
    this.notification.showNotif('Successfully Registered', 'confirm');

    this.registerForm.patchValue({
      email: this.registerForm.value.email.toString().toLowerCase(),
    });

    this.loading = true;

    this.userservice
      .register(this.registerForm.value)
      .pipe(first())
      .subscribe(
        (data) => {
          //  this.alertService.success('Registration successful', true);
          this.router.navigate(['/login']);
        },
        (error) => {
          console.log('Error:', error);
          this.notification.showNotif(error);
          this.loading = false;
        }
      );
  }
}
