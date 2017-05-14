import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ScriptService {

  constructor(private http: Http) {
  }

  getScriptsStats() {
    const headers = new Headers();
    return this.http.get('http://localhost:3001/files/stats', {headers: headers}).map(res => res.json());
  }

}
