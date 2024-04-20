import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrganizationService {
  constructor(private http: HttpClient) {}

  addProfile(profile) {
    return this.http.post(
      environment.backend + `/organizations/addorg`,
      profile
    );
  }

  public getOrgList(campus) {
    return this.http.get(environment.backend + `/organizations/getAllOrgs`, {
      params: {
        campus,
      },
    });
  }

  public getOrg(id) {
    return this.http.get(environment.backend + `/organizations/getOrgByName`, {
      params: {
        id,
      },
    });
  }

  public getFeaturedOrg(campus) {
    return this.http.get(
      environment.backend + `/organizations/getFeaturedOrg`,
      {
        params: {
          campus,
        },
      }
    );
  }

  public editProfile(profile) {
    return this.http.post(environment.backend + `/organizations/editOrg`, {
      responseType: 'json',
      params: { profile },
    });
  }
}
