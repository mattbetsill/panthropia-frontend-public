import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../services/navigation.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(
    private nav: NavigationService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      const campus = params.campusName;
      this.nav.setHeaderName(campus);
    });
  }
  ngOnDestroy(): void {
    this.nav.setHeaderName('');
  }
}
