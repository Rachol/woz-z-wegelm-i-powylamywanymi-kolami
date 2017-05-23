import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment'

@Injectable()
export class ScriptService {

  constructor(private http: Http) {
  }

  getScriptsStats() {
    const headers = new Headers();
    return this.http.get(environment.serverUrl + '/files/stats', {headers: headers}).map(res => res.json());
  }

}
