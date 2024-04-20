import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CampusesComponent } from './campuses/campuses.component';
import { TimelineComponent } from './timeline/timeline.component';
import { OrganizationsComponent } from './organizations/organizations.component';
import { SettingsComponent } from './settings/settings.component';
import { RegisterComponent } from './orgregister/register.component';
import { AboutComponent } from './about/about.component';
import { OrgloginComponent } from './login/orglogin.component';
import { CreateeventComponent } from './createevent/createevent.component';
import { HomeComponent } from './home/home.component';
import { EditeventComponent } from './editevent/editevent.component';
import { UserregisterComponent } from './userregister/userregister.component';
import { ProfileComponent } from './profile/profile.component';
import { EditprofileComponent } from './editprofile/editprofile.component';
import { AttendancedataComponent } from './attendancedata/attendancedata.component';
import { OrganizationattendanceComponent } from './organizationattendance/organizationattendance.component';
import { MyeventsComponent } from './myevents/myevents.component';
import { UserprofileComponent } from './userprofile/userprofile.component';
import { EdituseraccountComponent } from './edituseraccount/edituseraccount.component';
import { EditorguseraccountComponent } from './editorguseraccount/editorguseraccount.component';
import { UserorgprofileComponent } from './userorgprofile/userorgprofile.component';
import { CalendarComponent } from './calendar/calendar.component';
import { EventpageComponent } from './eventpage/eventpage.component';
import { QrcodeviewerComponent } from './qrcodeviewer/qrcodeviewer.component';
import { AttendancepageComponent } from './attendancepage/attendancepage.component';
import { ExcusespageComponent } from './excusespage/excusespage.component';
import { ResetpasswordrequestComponent } from './resetpasswordrequest/resetpasswordrequest.component';
import { ResetpasswordpageComponent } from './resetpasswordpage/resetpasswordpage.component';
import { RecoverusernameComponent } from './recoverusername/recoverusername.component';

const routes: Routes = [
  { path: 'organizations', component: OrganizationsComponent },
  { path: 'recoverusernamerequest', component: RecoverusernameComponent },
  { path: 'resetpasswordrequest', component: ResetpasswordrequestComponent },
  { path: 'resetpassword', component: ResetpasswordpageComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'about', component: AboutComponent },
  { path: 'login', component: OrgloginComponent },
  { path: 'userregister', component: UserregisterComponent },
  { path: 'createevent', component: CreateeventComponent },
  { path: 'userprofile', component: UserprofileComponent },
  { path: 'userorgprofile', component: UserorgprofileComponent },
  { path: 'edituserprofile', component: EdituseraccountComponent },
  { path: 'editorguserprofile', component: EditorguseraccountComponent },
  { path: '', component: CampusesComponent },
  {
    path: 'campus/:campusName',
    component: HomeComponent,
    pathMatch: 'prefix',
    children: [
      {
        path: 'organizations',
        component: OrganizationsComponent,
        pathMatch: 'prefix',
        children: [
          { path: 'organizations/:orgname', component: OrganizationsComponent },
        ],
      },
      {
        path: 'attendancedata',
        component: AttendancedataComponent,
        pathMatch: 'prefix',
        children: [
          {
            path: 'myorganization',
            component: OrganizationattendanceComponent,
          },
          { path: 'myevents', component: MyeventsComponent },
        ],
      },
      { path: 'createevent', component: CreateeventComponent },
      { path: 'event', component: EventpageComponent },
      { path: 'timeline', component: TimelineComponent },
      { path: 'calendar', component: CalendarComponent },
      { path: 'excusesubmission', component: ExcusespageComponent },
      { path: 'attendancesubmission', component: AttendancepageComponent },
      { path: 'edit', component: EditeventComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'editprofile', component: EditprofileComponent },
      { path: 'qrcode', component: QrcodeviewerComponent },
      { path: '', redirectTo: 'timeline', pathMatch: 'full' },
    ],
  },
  { path: '**', component: CampusesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
