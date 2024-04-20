import { Component, OnInit } from '@angular/core';
import {
  trigger,
  state,
  transition,
  style,
  animate,
} from '@angular/animations';
import { NavigationService } from '../services/navigation.service';
import { CampusService } from '../services/campus.service';
import { Campus } from '../models/campus';

@Component({
  selector: 'app-campuses',
  templateUrl: './campuses.component.html',
  styleUrls: ['./campuses.component.css'],
  animations: [
    // the fade-in/fade-out animation.
    trigger('simpleFadeAnimation', [
      // the "in" style determines the "resting" state of the element when it is visible.
      state('in', style({ opacity: 1 })),

      // fade in when created. this could also be written as transition('void => *')
      transition(':enter', [style({ opacity: 0 }), animate(1000)]),
    ]),
  ],
})
export class CampusesComponent implements OnInit {
  selectedCampus: Campus;
  campuses;
  constructor(
    private nav: NavigationService,
    private campusService: CampusService
  ) {
    this.campuses = [];
    this.campusService.getCampuses().subscribe((campuses: Campus[]) => {
      this.campuses = campuses;
    });
  }

  ngOnInit(): void {
    this.nav.setShowNav(false);
  }

  setCampus() {
    this.campusService.setCurrentCampus(this.selectedCampus);
  }
}
