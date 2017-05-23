import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment'
import {AuthService} from "./auth.service";

export interface SimulateData {
  scriptFiles: string[];
}

@Injectable()
export class ScriptService {

  constructor(private http: Http,
              private auth: AuthService) {
  }

  getScriptsStats() {
    const headers = new Headers();
    return this.http.get(environment.serverUrl + '/files/stats', {headers: headers}).map(res => res.json());
  }

  simulateGame(data: SimulateData){
    const headers = new Headers();
    headers.append('Authorization', this.auth.getToken());
    headers.append('Content-Type', 'application/json');
    return this.http.post(environment.serverUrl + '/files/editor',
      {data: data}, {headers: headers}).map(res => res.json());
  }

  getEditorContent() {
    const headers = new Headers();
    headers.append('Authorization', this.auth.getToken());
    headers.append('Content-Type', 'application/json');
    return this.http.get(environment.serverUrl + '/files/editor', {headers: headers}).map(res => res.json());
  }

  saveEditorContent(data: string) {
    const headers = new Headers();
    headers.append('Authorization', this.auth.getToken());
    headers.append('Content-Type', 'application/json');
    console.log(this.auth.getToken());
    console.log(environment.serverUrl + '/files/editor');
    return this.http.post(environment.serverUrl + '/files/editor',
      {data: data.substring(0, 100000)}, {headers: headers}).map(res => res.json());
  }
}
