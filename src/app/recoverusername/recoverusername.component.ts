import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-recoverusername',
  templateUrl: './recoverusername.component.html',
  styleUrls: ['./recoverusername.component.css'],
})
export class RecoverusernameComponent implements OnInit {
  registerForm: FormGroup;
  submitted: boolean;
  constructor(
    private formBuilder: FormBuilder,
    private notif: NotificationService,
    private user: UserService,
    private router: Router,
    private route: ActivatedRoute
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
      .sendUsernameEmail(this.registerForm.value.email)
      .subscribe((emailpresent) => {
        if (emailpresent) {
          this.notif.showSuccess(
            'Check your email!',
            'Username has been sent.'
          );
          this.router.navigate(['../login'], { relativeTo: this.route });
        } else {
          this.notif.showError(
            'That email is not associated with an account.',
            'Account Not Found'
          );
        }
      });
  }
}
