import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { NavigationService } from './services/navigation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Panthropia';
  currentuser: any;
  constructor(
    private router: Router,
    private navService: NavigationService,
    private authService: AuthService
  ) {
    // this.userservice.getCurrentUser().subscribe(user => this.currentuser = user);
  }

  ngOnInit(): void {
    this.authService.currentUserValueObservable.subscribe(
      (user) => (this.currentuser = user)
    );
  }

  logout() {
    this.authService.logout();
    this.navService.setShowNav(false);
    this.router.navigate(['/']);
  }
}
