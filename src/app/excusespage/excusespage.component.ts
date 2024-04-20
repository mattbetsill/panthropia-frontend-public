import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { EventService } from '../services/event.service';
import { ExcuseService } from '../services/excuse.service';
import { NotificationService } from '../services/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-excusespage',
  templateUrl: './excusespage.component.html',
  styleUrls: ['./excusespage.component.css'],
})
export class ExcusespageComponent implements OnInit {
  registerForm: any;

  constructor(
    private event: EventService,
    private route: ActivatedRoute,
    private auth: AuthService,
    private excuse: ExcuseService,
    private notif: NotificationService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.event.getOneEvent(params.id).subscribe((event) => {
        this.registerForm = this.formBuilder.group({
          approval: ['Pending'],
          info: ['', [Validators.required]],
          hostref: [event.hostref],
          campusref: [event.campusref._id],
          userref: [this.auth.currentUserValue._id],
          eventref: [params.id],
          createddatetime: [''],
          isgroupsubmission: [false],
          createdBy: [this.auth.currentUserValue._id],
        });
      });
    });
  }

  async onSubmit() {
    this.registerForm.patchValue({
      createddatetime: new Date(),
    });
    if (this.registerForm.invalid) {
      console.log('Error in onSubmit()');
      return;
    }

    this.excuse.postExcuse(this.registerForm.value).subscribe((rec) => {
      console.log(rec);
      this.notif.showNotif('Excuse Submitted');
      this.router.navigate(['../timeline'], { relativeTo: this.route });
    });
  }
}
