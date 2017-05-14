import {Component, OnInit} from '@angular/core';
import {FileUploader} from 'ng2-file-upload';
import {AuthService, UpdateUserData} from '../../services/auth.service';

const URL = 'http://localhost:3001/files/upload';

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

  public uploader: FileUploader = new FileUploader({url: URL});
  public hasBaseDropZoneOver = false;
  public hasAnotherDropZoneOver = false;
  public uploading = false;

  private userData: UpdateUserData;
  private userTableData: ScriptData[];
  private allowAdd = true;

  constructor(private authService: AuthService) {
    this.refreshData();
    this.uploader.onProgressAll = (progress: any) => {
      if (progress >= 100) {
        this.uploading = false;
        console.log("Refresh");
        this.refreshData();
      }
    };
  }

  ngOnInit() {
  }

  public updateScript(event: any, index: number) {
    // first upload the new script, then on success, remove old script
    const files = event.srcElement.files;
    this.uploader.clearQueue();
    this.uploader.addToQueue(files);
    this.uploader.queue[0].onBuildForm = (form: any) => {
      form.append('username', this.userData.username);
      form.append('scriptName', typeof index != 'undefined' ? this.userTableData[index].name : "");
      form.append('uploadTime', Date.now());
    };
    this.uploader.uploadAll();
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
