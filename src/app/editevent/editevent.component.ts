import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NavigationService } from '../services/navigation.service';
import { EventService } from '../services/event.service';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, formatDate } from '@angular/common';
import { NotificationService } from '../services/notification.service';
import { Event } from '../models/event';
import { first } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { deepCloneNode } from '@angular/cdk/drag-drop/clone-node';
import { CompressorConfig, ImageCompressorService } from 'ngx-image-compressor';
import { OrganizationService } from '../services/organization.service';
import { v4 as uuid } from 'uuid';
import { AttendanceService } from '../services/attendance.service';
import { ImageserviceService } from '../services/imageservice.service';

@Component({
  selector: 'app-editevent',
  templateUrl: './editevent.component.html',
  styleUrls: ['./editevent.component.css'],
})
export class EditeventComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  campuses = [];
  imagePresent = false;
  file: any;
  url: any;
  editedEvent: Event = null;
  formattedDate: string;
  previousImage: any;
  previousID: string;
  enableSelect = new FormControl(false);
  organizations: any;
  eventTypes = ['Philanthropy', 'Rush', 'Other'];
  eventType: string;
  constructor(
    private formBuilder: FormBuilder,
    private nav: NavigationService,
    private eventService: EventService,
    private userservice: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private notifService: NotificationService,
    private authService: AuthService,
    private imageCompressor: ImageCompressorService,
    private activeRoute: ActivatedRoute,
    private orgservice: OrganizationService,
    private attendance: AttendanceService,
    private imageService: ImageserviceService
  ) {
    this.loadEvent();
  }

  ngOnInit() {
    this.loadEvent();
  }

  private loadEvent() {
    this.route.queryParams.subscribe((params) => {
      console.log(params);
      let altparams = { id: null };
      altparams.id = '000000000000';
      this.eventService
        .getOneEvent(params.id ? [params.id] : [altparams.id])
        .subscribe(
          (event) => {
            this.previousID = event._id;
            this.eventType = event.eventType;
            this.editedEvent = JSON.parse(JSON.stringify(event));
            this.previousImage = event.flyer;

            let privateList = [];
            console.log(this.editedEvent);
            for (let i = 0; i < this.editedEvent.privateorgsref.length; i++) {
              privateList.push(this.editedEvent.privateorgsref[i].organization);
            }

            this.registerForm = this.formBuilder.group({
              eventName: [this.editedEvent.eventName, [Validators.required]],
              charity: [this.editedEvent.charity, [Validators.required]],
              date: [this.editedEvent.date, [Validators.required]],
              starttime: [this.editedEvent.starttime, [Validators.required]],
              endtime: [this.editedEvent.endtime, [Validators.required]],
              info: [this.editedEvent.info],
              enddate: [this.editedEvent.enddate],
              multipledayevent: [this.editedEvent.multipledayevent],
              endDateTime: [''],
              flyer: [this.editedEvent.flyer],
              campus: [this.editedEvent.campusref.name],
              host: [this.editedEvent.hostref.organization],
              privateOrganizations: [privateList],
              privateEvent: [this.editedEvent.privateEvent],
              dateTime: [''],
              eventType: [this.editedEvent.eventType],
              privateorgsref: [this.editedEvent.privateorgsref],
              hasLocation: [this.editedEvent.hasLocation],
              location: [
                this.editedEvent.location ? this.editedEvent.location : '',
              ],
              qrcoderequired: [
                this.editedEvent.qrcoderequired,
                [Validators.required],
              ],
              proofrequired: [this.editedEvent.proofrequired],
              groupsubmissionallowed: [this.editedEvent.groupsubmissionallowed],
            });

            this.registerForm.patchValue({
              date: formatDate(this.editedEvent.date, 'yyyy-MM-dd', 'en-US'),
              enddate: formatDate(
                this.editedEvent.enddate,
                'yyy-MM-dd',
                'en-US'
              ),
            });
            if (this.editedEvent.flyer) {
              this.imagePresent = true;
              this.attendance
                .gets3Get(this.editedEvent.flyer)
                .subscribe((url: any) => {
                  this.url = url;
                });
            }

            this.registerForm.patchValue({
              eventName: this.editedEvent.eventName,
            });
            this.enableSelect.setValue(this.editedEvent.privateEvent);
            this.orgservice
              .getOrgList(this.authService.currentUserValue.campusref._id)
              .subscribe((result) => (this.organizations = result));
          },
          (error) => {
            this.notifService.showNotif(error.toString(), 'warning');
          }
        );
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  setEventType(value) {
    this.eventType = value;
  }

  async onFileChanged(event: any) {
    console.log('here');
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

  resetMultipleDays() {
    if (!this.registerForm.value.multipledayevent) {
      this.registerForm.patchValue({
        enddate: this.registerForm.value.date,
      });
    }
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.registerForm.value.eventType !== 'Philanthropy') {
      this.registerForm.patchValue({
        charity: 'N/A',
      });
    }
    if (this.registerForm.invalid) {
      console.log('Error in onSubmit()');
      return;
    }
    this.resetMultipleDays();
    const trueDate = new Date(this.registerForm.value.date);
    trueDate.setDate(trueDate.getDate() + 1);
    const trueEndDate = new Date(this.registerForm.value.enddate);
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
      enddate: trueEndDate,
    });
    this.loading = true;
    const currentOrg = this.authService.currentUserValue.orgref.organization;
    this.registerForm.patchValue({
      host: currentOrg,
      privateEvent: this.enableSelect.value,
    });
    const privOrgs = this.registerForm.value.privateOrganizations;
    if (this.enableSelect.value === false) {
      this.registerForm.patchValue({
        privateOrganizations: [],
        privateorgsref: [],
      });
    }
    if (!this.registerForm.value.qrcoderequired) {
      this.registerForm.addControl('qrcode', new FormControl(null));
    } else {
      if (!this.registerForm.value.privateOrganizations.includes(currentOrg)) {
        privOrgs.push(currentOrg);

        this.registerForm.patchValue({
          privateOrganizations: privOrgs,
        });
      }
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
    console.log(this.registerForm.value.flyer);
    console.log(this.previousImage);
    if (this.registerForm.value.flyer !== this.previousImage) {
      this.notifService.showInfo('Image Uploading...', 'Loading');
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

    // console.log(this.registerForm.value);this.eventservice.deleteEvent(this.previousVersion.eventname,
    //   this.previousVersion.host, this.previousVersion.date, this.previousVersion.campus, false);
    this.nav
      .getHeaderName()
      .subscribe((name) => this.registerForm.patchValue({ campus: name }));

    this.eventService
      .editEvent(this.previousID, this.registerForm.value)
      .pipe(first())
      .subscribe((result) => {
        this.router.navigate(['../timeline'], { relativeTo: this.activeRoute });
      });
  }
}
