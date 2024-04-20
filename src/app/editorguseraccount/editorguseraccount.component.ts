import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { NotificationService } from '../services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-editorguseraccount',
  templateUrl: './editorguseraccount.component.html',
  styleUrls: ['./editorguseraccount.component.css'],
})
export class EditorguseraccountComponent implements OnInit {
  enableKey = new FormControl(false);
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
      organization: [this.currentUser.organization, [Validators.required]],

      email: [this.currentUser.email, [Validators.required, Validators.email]],
      isprivate: [
        this.currentUser.orgref ? this.currentUser.orgref.isprivate : false,
      ],
      key: [this.currentUser.orgref ? this.currentUser.orgref.key : ''],
    });
    this.enableKey.setValue(this.registerForm.value.isprivate);
  }

  get f() {
    return this.registerForm.controls;
  }

  async onSubmit(event) {
    this.submitted = true;

    if (event === 'cancel') {
      this.router.navigate(['../userorgprofile']);
      return;
    }
    this.registerForm.patchValue({
      isprivate: this.enableKey.value,
    });

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      console.log('Error in onSubmit()');
      return;
    }

    this.registerForm.patchValue({
      email: this.registerForm.value.email.toString().toLowerCase(),
    });

    if (this.currentUser.orgref) {
      this.userService
        .editUserOrg(this.registerForm.value, this.currentUser.orgref._id)
        .subscribe(
          (user) => {
            this.auth.logout();
            this.notifService.showNotif(
              'Please re-authenticate to update your user info!',
              'Log In',
              8000
            );
            this.router.navigate(['/login']);
          },
          (err) =>
            this.notifService.showError(
              'Email is already in use',
              'Cannot update'
            )
        );
    } else {
      this.notifService.showNotif(
        'Please create your organization profile first in the Profile tab!',
        'Info',
        8000
      );
    }
  }
}
