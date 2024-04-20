import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationService } from '../services/navigation.service';
import { EventService } from '../services/event.service';
import { NotificationService } from '../services/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { OrganizationService } from '../services/organization.service';
import { User } from '../models/user';
import { Organization } from '../models/organization';
import { v4 as uuid } from 'uuid';
import { AttendanceService } from '../services/attendance.service';
import { ColorEvent } from 'ngx-color';
import { ImageserviceService } from '../services/imageservice.service';

@Component({
  selector: 'app-editprofile',
  templateUrl: './editprofile.component.html',
  styleUrls: ['./editprofile.component.css'],
})
export class EditprofileComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  campuses = [];
  imagePresent = true;
  file: any;
  url: any;
  currentUser: User;
  createdBy: string;
  origData: any;
  organizationn;
  selectedcolor: string;
  showOverlay: boolean;
  constructor(
    private formBuilder: FormBuilder,
    private nav: NavigationService,
    private eventService: EventService,
    private notifService: NotificationService,
    private router: Router,
    private userservice: UserService,
    private authService: AuthService,
    private orgservice: OrganizationService,
    private activatedroute: ActivatedRoute,
    private attendance: AttendanceService,
    private imageService: ImageserviceService
  ) {
    this.currentUser = this.authService.currentUserValue;
    this.registerForm = this.formBuilder.group({
      organization: ['', [Validators.required]],
      charity: ['', [Validators.required]],
      campus: [''],
      bio: [''],
      image: [''],
      createdBy: [''],
      userref: [''],
      campusref: [''],
      primarycolor: [''],
    });
    this.showOverlay = false;
  }

  ngOnInit(): void {
    this.orgservice
      .getOrg(
        this.currentUser.orgref ? this.currentUser.orgref._id : '000000000000'
      )
      .subscribe((org: Organization) => {
        if (!org) {
          this.organizationn = new Organization();
          this.organizationn.organization =
            'Edit your profile to add your organization to the organizations tab';
          this.organizationn.image = null;
          this.organizationn.charity = 'charity placeholder';
          this.organizationn.bio = 'bio placeholder';
          this.registerForm = this.formBuilder.group({
            organization: [
              this.currentUser.organization,
              [Validators.required],
            ],
            charity: [this.organizationn.charity, [Validators.required]],
            bio: [this.organizationn.bio],
            image: [this.organizationn.image],
            createdBy: [this.organizationn.createdBy],
            userref: [this.currentUser._id],
            campusref: [this.currentUser.campusref._id],
            primarycolor: ['#53B79F'],
          });
          this.selectedcolor = '#53B79F';
        } else {
          this.organizationn = org;

          this.registerForm = this.formBuilder.group({
            organization: [org.organization, [Validators.required]],
            charity: [org.charity, [Validators.required]],
            bio: [org.bio],
            image: [org.image],
            createdBy: [org.createdBy],
            userref: [org.userref._id],
            campusref: [org.campusref._id],
            primarycolor: [org.primarycolor],
          });
          this.selectedcolor = org.primarycolor;

          if (this.registerForm.value.image !== null) {
            this.imagePresent = true;
            this.attendance
              .gets3Get(this.registerForm.value.image)
              .subscribe((url: any) => {
                this.url = url;
                this.registerForm.patchValue({ image: org.image });
              });
          }
        }
        this.origData = org;
      });
  }

  // convenience getter for easy access to form fields
  // tslint:disable-next-line:typedef
  get f() {
    return this.registerForm.controls;
  }

  handleChange($event: ColorEvent) {
    this.selectedcolor = $event.color.hex;
    this.registerForm.patchValue({
      primarycolor: this.selectedcolor,
    });
  }

  async onFileChanged(event: any) {
    this.imagePresent = true;
    const localFile = event.target.files[0];
    this.file = localFile;
    this.imageService.resizeImage(750, this.file).then((resizedFile: any) => {
      const reader = new FileReader();
      this.file = resizedFile;
      reader.onload = (e) => {
        this.url = e.target.result;
      };
      reader.readAsDataURL(resizedFile);

      this.registerForm.patchValue({
        image: 'organization/' + uuid() + localFile.name,
      });
    });
  }

  toggleOverlay() {
    this.showOverlay = !this.showOverlay;
  }

  async onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      console.log('Error in onSubmit()');
      return;
    }
    this.registerForm.patchValue({ createdBy: this.createdBy });

    this.loading = true;
    if (!this.registerForm.value.campusref) {
      this.registerForm.patchValue({
        userref: this.currentUser._id,
        campusref: this.currentUser.campusref._id,
      });
    }
    this.registerForm.patchValue({
      primarycolor: this.selectedcolor,
    });
    if (
      this.origData &&
      this.registerForm.value.image !== this.origData.image
    ) {
      this.notifService.showInfo('Image Uploading...', 'Loading');
      this.attendance
        .getS3Put(this.registerForm.value.image)
        .subscribe(async (presignedPostData: any) => {
          const formData = new FormData();
          Object.keys(presignedPostData.fields).forEach((key) => {
            formData.append(key, presignedPostData.fields[key]);
          });
          formData.append('file', this.file);
          const upload = await fetch(presignedPostData.url, {
            method: 'POST',
            body: formData,
          });
          if (upload.ok) {
            this.notifService.showSuccess('Image Uploaded', 'Success');

            console.log('upload successful');
          } else {
            console.error('upload failed');
            this.notifService.showWarning('Image Upload Failed', 'Failed');
          }
        });
    }

    this.orgservice
      .editProfile(this.registerForm.value)
      .subscribe((org: any) => {
        console.log(org);
        if (!this.currentUser.orgref) {
          this.userservice.editUser({ orgref: org._id }).subscribe((user) => {
            this.authService.logout();
            this.notifService.showNotif(
              'Please re-authenticate (this only happens once)',
              'Log In',
              8000
            );
            this.router.navigate(['/login']);
          });
        }
      });

    this.router.navigate(['../profile'], { relativeTo: this.activatedroute });
  }
}
