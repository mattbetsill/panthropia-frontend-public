import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  emailIssue() {
    window.location.href =
      'mailto:matthewb22@vt.edu?subject=Panthropia Issue/Bug Found&body=Please describe the issue you are encountering. I will try to get it fixed asap!';
  }

  emailEdit() {
    window.location.href =
      'mailto:matthewb22@vt.edu?subject=Panthropia Edit Request&body=Please outline any features or edits you would like to see on the site!';
  }

  emailForCampus() {
    window.location.href =
      'mailto:matthewb22@vt.edu?subject=Panthropia Campus Request&body=Please state the name of your campus so Panthropia can add it to the site!';
  }
}
