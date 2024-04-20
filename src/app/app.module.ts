import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CampusesComponent } from './campuses/campuses.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { HeaderComponent } from './header/header.component';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { TimelineComponent } from './timeline/timeline.component';
import { TabsComponent } from './tabs/tabs.component';
import { EventComponent } from './event/event.component';
import { DialogAttended } from './dialogattended/dialogattended.component';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { OrganizationsComponent } from './organizations/organizations.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OrglistComponent } from './orglist/orglist.component';
import { IndividualorgComponent } from './individualorg/individualorg.component';
import { AboutComponent } from './about/about.component';
import { RegisterComponent } from './orgregister/register.component';
import { SettingsComponent } from './settings/settings.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { OrgloginComponent } from './login/orglogin.component';
import { CreateeventComponent } from './createevent/createevent.component';
import { HomeComponent } from './home/home.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { EditeventComponent } from './editevent/editevent.component';
import { UserregisterComponent } from './userregister/userregister.component';
import { ProfileComponent } from './profile/profile.component';
import { EditprofileComponent } from './editprofile/editprofile.component';
import { MatDialogModule } from '@angular/material/dialog';
import { AttendancedataComponent } from './attendancedata/attendancedata.component';
import { EventdataComponent } from './eventdata/eventdata.component';
import { UserdataComponent } from './userdata/userdata.component';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { OrganizationattendanceComponent } from './organizationattendance/organizationattendance.component';
import { MyeventsComponent } from './myevents/myevents.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxImageCompressorModule } from 'ngx-image-compressor';
import { UserprofileComponent } from './userprofile/userprofile.component';
import { AgGridModule } from 'ag-grid-angular';
import { OrgattendancegridComponent } from './orgattendancegrid/orgattendancegrid.component';
import { GridcheckboxComponent } from './gridcheckbox/gridcheckbox.component';
import { FooterComponent } from './footer/footer.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ProofimageComponent } from './proofimage/proofimage.component';
import { DeleteattendanceComponent } from './deleteattendance/deleteattendance.component';
import { EdituseraccountComponent } from './edituseraccount/edituseraccount.component';
import { EditorguseraccountComponent } from './editorguseraccount/editorguseraccount.component';
import { InfobannerComponent } from './infobanner/infobanner.component';
import { DeletememberComponent } from './deletemember/deletemember.component';
import { UserorgprofileComponent } from './userorgprofile/userorgprofile.component';
import { OrganizationdataComponent } from './organizationdata/organizationdata.component';
import { EventattendancegridComponent } from './eventattendancegrid/eventattendancegrid.component';
import { CalendarComponent } from './calendar/calendar.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { EventpageComponent } from './eventpage/eventpage.component';
import { ColorSketchModule } from 'ngx-color/sketch';
import { MatTooltipModule } from '@angular/material/tooltip';
import { QRCodeModule } from 'angularx-qrcode';
import { QrcodeviewerComponent } from './qrcodeviewer/qrcodeviewer.component';
import { AttendancepageComponent } from './attendancepage/attendancepage.component';
import { ToastrModule } from 'ngx-toastr';
import { ExcusespageComponent } from './excusespage/excusespage.component';
import { DeleteexcuseComponent } from './deleteexcuse/deleteexcuse.component';
import { GridexcuseapprovalComponent } from './gridexcuseapproval/gridexcuseapproval.component';
import { ResetpasswordrequestComponent } from './resetpasswordrequest/resetpasswordrequest.component';
import { ResetpasswordpageComponent } from './resetpasswordpage/resetpasswordpage.component';
import { RecoverusernameComponent } from './recoverusername/recoverusername.component';

//I keep the new line
@NgModule({
  declarations: [
    AppComponent,
    CampusesComponent,
    SideNavComponent,
    HeaderComponent,
    TimelineComponent,
    TabsComponent,
    EventComponent,
    OrganizationsComponent,
    OrglistComponent,
    IndividualorgComponent,
    AboutComponent,
    RegisterComponent,
    SettingsComponent,
    OrgloginComponent,
    CreateeventComponent,
    HomeComponent,
    EditeventComponent,
    UserregisterComponent,
    ProfileComponent,
    EditprofileComponent,
    DialogAttended,
    AttendancedataComponent,
    EventdataComponent,
    UserdataComponent,
    OrganizationattendanceComponent,
    MyeventsComponent,
    UserprofileComponent,
    OrgattendancegridComponent,
    GridcheckboxComponent,
    FooterComponent,
    ProofimageComponent,
    DeleteattendanceComponent,
    EdituseraccountComponent,
    EditorguseraccountComponent,
    InfobannerComponent,
    DeletememberComponent,
    UserorgprofileComponent,
    OrganizationdataComponent,
    EventattendancegridComponent,
    CalendarComponent,
    EventpageComponent,
    QrcodeviewerComponent,
    AttendancepageComponent,
    ExcusespageComponent,
    DeleteexcuseComponent,
    GridexcuseapprovalComponent,
    ResetpasswordrequestComponent,
    ResetpasswordpageComponent,
    RecoverusernameComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSelectModule,
    MatButtonModule,
    AppRoutingModule,
    MatCardModule,
    FormsModule,
    MatButtonToggleModule,
    NgbModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    MatInputModule,
    MatMenuModule,
    MatIconModule,
    MatInputModule,
    HttpClientModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    NgxImageCompressorModule,
    AgGridModule.withComponents([]),
    MatCheckboxModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    ColorSketchModule,
    MatTooltipModule,
    QRCodeModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
