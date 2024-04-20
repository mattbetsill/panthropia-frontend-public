import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Role } from '../models/role';
import { Router } from '@angular/router';
import { NotificationService } from './notification.service';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private notif: NotificationService
  ) {}

  getAll() {
    return this.http.get<User[]>(environment.backend + `/user/allusers`);
  }
  register(user: User) {
    console.log(user);
    return this.http.post(environment.backend + `/user/register`, user);
  }

  editUser(body) {
    return this.http.post(environment.backend + '/user/edit', body);
  }

  editUserOrg(body, orgref) {
    return this.http.post(environment.backend + '/user/edituserorg', body, {
      params: { orgref },
    });
  }

  getOrgMembers(orgref) {
    return this.http.get(environment.backend + '/user/getOrgMembers', {
      params: { orgref },
    });
  }

  setIndependent(userref) {
    return this.http.get(environment.backend + '/user/setIndependent', {
      params: { userref },
    });
  }

  sendPasswordEmail(email) {
    return this.http.get(environment.backend + '/user/resetPasswordEmail', {
      params: { email },
    });
  }

  sendUsernameEmail(email) {
    return this.http.get(environment.backend + '/user/recoverUsernameEmail', {
      params: { email },
    });
  }

  resetPassword(password, code) {
    console.log('Hewwe');
    return this.http.get(environment.backend + '/user/resetPassword', {
      params: { password, code },
    });
  }
  //
  // Matts functions for simulated backend
  //
  // login(username: string, password: string){
  //   const result = this.users.filter(obj => obj.username === username && obj.password === password);
  //   this.currentUser$.next(result[0]);
  //   if (result.length !== 1){
  //     this.notif.showNotif('incorrect login credentials');
  //   }else{
  //     this.router.navigate(['/campus/' + this.currentUser$.value.campus + '/timeline']);
  //   }
  //
  // }

  // logout(){
  //   this.currentUser$.next(null);
  // }
  //
  // getCurrentUser(){
  //   return this.currentUser$.asObservable();
  // }
  // getCurrentUserCampus(): string{
  //   return this.currentUser$.value.campus;
  // }
  // getCurrentUserOrg(): string{
  //   return this.currentUser$.value.organization;
  // }
  // addOrg(user: User){
  //   const result = this.users.filter(obj => obj.role === Role.admin &&
  //                    obj.organization.toLowerCase() === user.organization.toLowerCase());
  //   if (result.length !== 0){
  //     this.notif.showNotif('organization already has an account');
  //     return;
  //   }
  //   user.role = Role.admin;
  //   this.users.push(user);
  //
  // }
  //
  // addUser(user: User){
  //   const result = this.users.filter(obj => obj.username === user.username);
  //   if (result.length !== 0){
  //     this.notif.showNotif('username already exists');
  //     return;
  //   }
  //   user.role = Role.user;
  //   this.users.push(user);
  //
  // }
}
