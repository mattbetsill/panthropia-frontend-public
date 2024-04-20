import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../services/notification.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-resetpasswordrequest',
  templateUrl: './resetpasswordrequest.component.html',
  styleUrls: ['./resetpasswordrequest.component.css'],
})
export class ResetpasswordrequestComponent implements OnInit {
  registerForm: FormGroup;
  submitted: boolean;
  constructor(
    private formBuilder: FormBuilder,
    private notif: NotificationService,
    private user: UserService
  ) {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
    this.submitted = false;
  }

  ngOnInit(): void {}

  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.errors) {
      return;
    }

    this.user
      .sendPasswordEmail(this.registerForm.value.email.toString().toLowerCase())
      .subscribe((emailpresent) => {
        if (emailpresent) {
          this.notif.showSuccess('Check your email!', 'Resent Link Sent');
        } else {
          this.notif.showError(
            'That email is not associated with an account.',
            'Account Not Found'
          );
        }
      });
  }
}
