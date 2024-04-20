import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-organizations',
  templateUrl: './organizations.component.html',
  styleUrls: ['./organizations.component.css'],
})
export class OrganizationsComponent implements OnInit {
  organizations = [
    'Alpha Chi Omega',
    'Sigma Phi Delta',
    'Gamma Phi Beta',
    'Theta Chi',
    'Chi Omega',
  ];
  constructor() {}

  ngOnInit(): void {}
}
