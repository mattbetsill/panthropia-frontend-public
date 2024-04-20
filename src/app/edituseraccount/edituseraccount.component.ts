import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { NotificationService } from '../services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edituseraccount',
  templateUrl: './edituseraccount.component.html',
  styleUrls: ['./edituseraccount.component.css'],
})
export class EdituseraccountComponent implements OnInit {
  registerForm: FormGroup;
  currentUser;
  submitted = false;
  loading = false;
  constructor(
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private notifService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.auth.currentUserValue;
    this.registerForm = this.formBuilder.group({
      firstname: [
        this.currentUser.firstname,
        [Validators.required, Validators.pattern('^[a-zA-Z.-]+$')],
      ],
      lastname: [
        this.currentUser.lastname,
        [Validators.required, Validators.pattern('^[a-zA-Z.-]+$')],
      ],
      email: [this.currentUser.email, [Validators.required, Validators.email]],
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit(event) {
    this.submitted = true;
    if (event === 'cancel') {
      this.router.navigate(['../userprofile']);
      return;
    }

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      console.log('Error in onSubmit()');
      return;
    }

    this.registerForm.patchValue({
      email: this.registerForm.value.email.toString().toLowerCase(),
    });

    this.userService.editUser(this.registerForm.value).subscribe(
      (user: any) => {
        this.auth.logout();
        this.notifService.showNotif(
          'Please re-authenticate to update your user info!',
          'Log In',
          8000
        );
        this.router.navigate(['/login']);
      },
      (err) =>
        this.notifService.showError('Email is already in use', 'Cannot update')
    );
  }
}
