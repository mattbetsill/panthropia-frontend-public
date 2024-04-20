import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class ExcuseService {
  constructor(private http: HttpClient, private auth: AuthService) {}

  postExcuse(excuse) {
    return this.http.post(environment.backend + '/excuse/addExcuse', excuse);
  }

  getUserExcuses(userId) {
    return this.http.get(environment.backend + '/excuse/getUserExcuses', {
      responseType: 'json',
      params: { userId },
    });
  }

  getOrgExcuses(orgId) {
    return this.http.get(environment.backend + '/excuse/getOrgExcuses', {
      responseType: 'json',
      params: { orgId },
    });
  }

  deleteExcuse(id) {
    return this.http.delete(environment.backend + '/excuse/deleteExcuse', {
      responseType: 'json',
      params: { id },
    });
  }

  editExcuse(edits) {
    return this.http.post(environment.backend + '/excuse/editExcuse', edits);
  }

  getEventExcuses(id, orgid) {
    return this.http.get(environment.backend + '/excuse/getEventExcuses', {
      responseType: 'json',
      params: { id, orgid },
    });
  }
}
