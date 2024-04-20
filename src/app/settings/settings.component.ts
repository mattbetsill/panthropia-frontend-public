import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../services/navigation.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  checked: boolean;
  disabled: boolean;
  modeOutput = 'Night Mode';
  constructor(private nav: NavigationService) {}

  ngOnInit(): void {
    this.modeOutput = 'Night Mode';

    this.disabled = false;
    this.nav.setShowNav(false);
  }

  onSelect(event) {
    console.log(event.target.value);
    if (this.modeOutput === 'Night Mode') {
      this.modeOutput = 'Light Mode';
    }
  }

  getTitle() {}
}
