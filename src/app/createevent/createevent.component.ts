import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NavigationService } from '../services/navigation.service';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../services/event.service';
import { first } from 'rxjs/operators';
import { NotificationService } from '../services/notification.service';
import { AuthService } from '../services/auth.service';
import { CompressorConfig, ImageCompressorService } from 'ngx-image-compressor';
import { OrganizationService } from '../services/organization.service';
import { AttendanceService } from '../services/attendance.service';
import { v4 as uuid } from 'uuid';
import { ImageserviceService } from '../services/imageservice.service';
@Component({
  selector: 'app-createevent',
  templateUrl: './createevent.component.html',
  styleUrls: ['./createevent.component.css'],
})
export class CreateeventComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  campuses = [];
  imagePresent = false;
  file: any;
  url: any;
  organizations: any;
  enableSelect = new FormControl(false);
  showSecondDate = new FormControl(false);
  eventTypes = ['Philanthropy', 'Rush', 'Other'];
  eventType: string;
  constructor(
    private formBuilder: FormBuilder,
    private nav: NavigationService,
    private eventService: EventService,
    private notifService: NotificationService,
    private router: Router,
    private userservice: UserService,
    private authService: AuthService,
    private activatedroute: ActivatedRoute,
    private imageCompressor: ImageCompressorService,
    private orgservice: OrganizationService,
    private attendance: AttendanceService,
    private imageService: ImageserviceService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      eventName: ['', [Validators.required]],
      charity: ['', [Validators.required]],
      date: ['', [Validators.required]],
      starttime: ['', [Validators.required]],
      enddate: [''],
      endDateTime: [''],
      endtime: ['', [Validators.required]],
      info: [''],
      flyer: [''],
      host: [''],
      campus: [''],
      privateOrganizations: [[]],
      privateEvent: [''],
      dateTime: [''],
      eventType: ['', [Validators.required]],
      campusref: [''],
      hostref: [''],
      multipledayevent: [false, [Validators.required]],
      privateorgsref: [[]],
      location: [''],
      hasLocation: [false, [Validators.required]],
      qrcoderequired: [false, [Validators.required]],
      qrcode: [null],
      proofrequired: [true],
      groupsubmissionallowed: [true],
    });
    this.orgservice
      .getOrgList(this.authService.currentUserValue.campusref._id)
      .subscribe((result) => (this.organizations = result));
  }

  // convenience getter for easy access to form fields
  // tslint:disable-next-line:typedef
  get f() {
    return this.registerForm.controls;
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
        flyer: 'event/' + uuid() + resizedFile.name,
      });
    });
  }

  setEventType(value) {
    this.eventType = value;
  }

  onSubmit() {
    this.submitted = true;
    const trueDate = new Date(this.registerForm.value.date);
    const trueEndDate = new Date(
      this.registerForm.value.enddate
        ? this.registerForm.value.enddate
        : this.registerForm.value.date
    );
    trueDate.setDate(trueDate.getDate() + 1);
    trueEndDate.setDate(trueEndDate.getDate() + 1);
    const DateTime = new Date(
      trueDate.getTime() +
        parseInt(this.registerForm.value.starttime.replace(':', ''), 10) * 600
    );
    const EndDateTime = new Date(
      trueEndDate.getTime() +
        parseInt(this.registerForm.value.endtime.replace(':', ''), 10) * 600
    );
    this.registerForm.patchValue({
      date: trueDate,
      dateTime: DateTime,
      endDateTime: EndDateTime,
    });
    if (this.registerForm.value.eventType !== 'Philanthropy') {
      this.registerForm.patchValue({
        charity: 'N/A',
      });
    }
    if (this.registerForm.value.multipledayevent == true) {
      if (this.registerForm.value.enddate && this.registerForm.value.endtime) {
      } else {
        this.notifService.showNotif('Please enter the end date!');
        return;
      }
    }
    // stop here if form is invalid
    if (this.registerForm.invalid) {
      console.log('Error in onSubmit()');
      return;
    }

    if (this.registerForm.value.qrcoderequired) {
      this.registerForm.patchValue({
        qrcode: null,
      });
    }

    if (!this.registerForm.value.multipledayevent) {
      this.registerForm.patchValue({
        enddate: this.registerForm.value.date,
      });
    }

    const currentOrg = this.authService.currentUserValue.orgref.organization;

    this.loading = true;
    const privOrgs = this.registerForm.value.privateOrganizations;
    this.registerForm.patchValue({
      host: this.authService.currentUserValue.orgref.organization,
      privateEvent: this.enableSelect.value,
      campusref: this.authService.currentUserValue.campusref,
      hostref: this.authService.currentUserValue.orgref,
    });

    if (this.enableSelect.value === false) {
      this.registerForm.patchValue({
        privateOrganizations: [],
      });
    } else {
      if (!this.registerForm.value.privateOrganizations.includes(currentOrg)) {
        privOrgs.push(currentOrg);

        this.registerForm.patchValue({
          privateOrganizations: privOrgs,
        });
      }
    }
    if (this.registerForm.value.flyer !== '') {
      this.notifService.showInfo('Image Uploading...', 'Loading');
      console.log(this.registerForm.value);
      this.attendance
        .getS3Put(this.registerForm.value.flyer)
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

    if (this.registerForm.value.privateOrganizations !== []) {
      const privorgs = [];
      for (let i = 0; i < this.organizations.length; i++) {
        if (
          this.registerForm.value.privateOrganizations.includes(
            this.organizations[i].organization
          )
        ) {
          privorgs.push(this.organizations[i]._id);
        }
      }
      this.registerForm.patchValue({
        privateorgsref: privorgs,
      });
    }

    this.nav
      .getHeaderName()
      .subscribe((name) => this.registerForm.patchValue({ campus: name }));

    this.eventService
      .add(this.registerForm.value)
      .pipe(first())
      .subscribe(
        (data) => {
          //  this.alertService.success('Registration successful', true);
          this.router.navigate(['../timeline'], {
            relativeTo: this.activatedroute,
          });
        },
        (error) => {
          console.log('Error:', error);
          this.notifService.showNotif(error);
          this.loading = false;
        }
      );
  }
}
