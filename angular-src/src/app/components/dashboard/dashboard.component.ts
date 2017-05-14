import { Component, OnInit } from '@angular/core';
import {ScriptService} from '../../services/script.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public scriptsData: Array<any>

  constructor(private scriptService: ScriptService) { }

  ngOnInit() {
    this.refreshData();
  }

  refreshData() {
    this.scriptService.getScriptsStats().subscribe(data => {
        console.log(data);
        this.scriptsData = data.sort(compareScore);
      },
      err => {
        console.log(err);
        return false;
      });
  }

}


function compareScore(a, b) {
  if (a.wins/a.games > b.wins/b.games) {
    return -1;
  }
  if (a.wins/a.games < b.wins/b.games) {
    return 1;
  }
  // a must be equal to b
  return 0;
}

