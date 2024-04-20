import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../services/event.service';

@Component({
  selector: 'app-qrcodeviewer',
  templateUrl: './qrcodeviewer.component.html',
  styleUrls: ['./qrcodeviewer.component.css'],
})
export class QrcodeviewerComponent implements OnInit {
  code: string;
  eventdata: any;
  windowheight: any;
  url: any;
  constructor(
    private event: EventService,
    private activeroute: ActivatedRoute,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.windowheight = Math.min(
      window.innerHeight * 0.8,
      window.innerWidth * 0.7
    );
    this.url = 'panthropia.com/login?code=';
  }

  ngOnInit(): void {
    this.activeroute.queryParams.subscribe((params) => {
      this.event.getQr(params.id).subscribe((codeobj: any) => {
        if (!codeobj.qrcode) {
          codeobj.previousqr = codeobj.qrcode;
          codeobj.qrcode = this.generateQr();
          this.event.editEvent(codeobj._id, codeobj).subscribe((result) => {
            this.code = codeobj.qrcode;
            this.eventdata = codeobj;

            this.url = this.url + this.code + '&id=' + codeobj._id;
          });
        } else {
          this.code = codeobj.qrcode;
          this.eventdata = codeobj;
          console.log(this.code, codeobj.id);
          this.url = this.url + this.code + '&id=' + codeobj._id;
        }
      });
    });
  }

  generateQr() {
    return (Math.random() * 1000000000).toString().split('.')[0];
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.windowheight = Math.min(
      event.target.innerWidth * 0.7,
      event.target.innerHeight * 0.8
    );
  }

  deactivate() {
    this.event.removeQrCode(this.eventdata._id).subscribe((removed) => {
      this.router.navigate(['../timeline'], { relativeTo: this.route });
    });
  }
}
