import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../services/navigation.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
})
export class AboutComponent implements OnInit {
  changeLink;
  constructor(private nav: NavigationService) {
    this.changeLink =
      'mailto:matthewb22@vt.edu?subject=Panthropia Request: Organization Name Change&body=Please provide your campus and current organization name. I will try to get it updated asap!';
  }

  ngOnInit(): void {
    this.nav.setShowNav(false);
  }
}
