import {Component, OnInit} from '@angular/core';
import {FileUploader, FileItem, ParsedResponseHeaders} from 'ng2-file-upload';
import {AuthService, UpdateUserData} from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { environment } from '../../../environments/environment'

const URL = environment.serverUrl + '/files/upload';

interface ScriptData {
  name: string;
  games: number;
  wins: number;
  date: string;
}

@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.css']
})
export class FileuploadComponent implements OnInit {

  uploader: FileUploader
  uploading = false;

  private userData: UpdateUserData;
  private userTableData: ScriptData[];
  private allowAdd = true;

  constructor(private authService: AuthService,
              private flashMessagesService: FlashMessagesService) {
    this.uploader = new FileUploader({url: URL, authToken: authService.getToken()});
    this.refreshData();
  }

  ngOnInit() {
  }

  public updateScript(event: any, index: number) {
    // first upload the new script, then on success, remove old script
    const files = event.srcElement.files;
    if (files.length > 0 && files[0].size < 100 * 1024) {
      this.uploader.authToken = this.authService.getToken();
      this.uploader.clearQueue();
      this.uploader.addToQueue(files);
      this.uploader.queue[0].onBuildForm = (form: any) => {
        form.append('scriptName', typeof index != 'undefined' ? this.userTableData[index].name : "");
        form.append('uploadTime', Date.now());
      };
      this.uploader.queue[0].upload();
    } else {
      this.flashMessagesService.show('File size too large, maximum allowed is around 100kB', {
        cssClass: 'alert-danger',
        timeout: 5000
      });
    }
  }

  public refreshData() {
    this.authService.getUserProfile().subscribe(profile => {
        this.userData = profile.user;
        this.userTableData = [];
        let newUserTableData: any[];
        newUserTableData = [];
        for (let entry of this.userData.scripts) {
          let uploadDate = new Date(entry.uploadDate);
          newUserTableData.push(
            {
              name: entry.name,
              games: entry.games,
              wins: entry.wins,
              date: uploadDate.toLocaleTimeString() + ", " + uploadDate.toLocaleDateString()
            }
          )
        }
        this.userTableData = newUserTableData;
        this.allowAdd = this.userTableData.length < 3 ? true : false;
      },
      err => {
        console.log(err);
        return false;
      });
  }
}
