import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-resetpasswordpage',
  templateUrl: './resetpasswordpage.component.html',
  styleUrls: ['./resetpasswordpage.component.css'],
})
export class ResetpasswordpageComponent implements OnInit {
  registerForm: FormGroup;
  submitted: boolean;
  code: string;
  constructor(
    private formBuilder: FormBuilder,
    private notif: NotificationService,
    private user: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      password2: ['', [Validators.required, Validators.minLength(6)]],
    });
    this.submitted = false;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      this.code = params.code;
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.errors) {
      console.log('here');
      return;
    }

    if (
      this.registerForm.value.password !== this.registerForm.value.password2
    ) {
      this.notif.showError('Passwords do not match.', 'Revise Password');
      return;
    }

    this.user
      .resetPassword(this.registerForm.value.password, this.code)
      .subscribe(
        (success) => {
          if (success) {
            this.notif.showSuccess('Password Reset!', 'Success');
            this.router.navigate(['../login'], { relativeTo: this.route });
          } else {
            this.notif.showError(
              'Likely due to expired link.',
              'Password Reset Unsucessful'
            );
          }
        },
        (err) => console.log(err)
      );
  }
}
