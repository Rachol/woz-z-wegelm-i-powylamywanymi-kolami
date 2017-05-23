import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import 'brace/theme/twilight';
import 'brace/mode/javascript';

declare var ace: any;

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  editor: any;
  text:string = "";
  aceOptions:any = {maxLines: 1000, printMargin: false};

  constructor(elementRef: ElementRef) {
    let el = elementRef.nativeElement;
    this.editor = ace["edit"](el);
    let me = this;
    let editor = this.editor;
    editor.setTheme('ace/theme/twilight');
    editor.getSession().setMode('ace/mode/javascript');
    editor.setReadOnly(false);
    editor.setValue(
`
function executeEvents() {
	if(robot.scanRobot(7.0) > 0) {
		robot.shoot();
	}
    else{
        robot.turnClockwise(7.0); 
    }
}`
    );
    //editor.getSession().on('change', function(e) {
    //  me.onChange(e);
    //});

    editor.commands.addCommand({
      name: 'myCommand',
      bindKey: {win: 'Ctrl-S',  mac: 'Command-S'},
      exec: function(editor) {
        try{
          me.evaluate(editor.getValue());
          me.onChange(editor)
        }catch(err){
          //do nothing, just want to check if the thing compiles
          let error = err.toString();
          console.log(err.stack);
        }
      },
      readOnly: true // false if this command should not apply in readOnly mode
    });

  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  onChange(code) {
    console.log(this.editor.getValue());
  }

  private evaluate(str: string) {
  var context =
    `
    console.log("maybe now");
    
    `;
    return eval(`(function(console) {${context}${str}})`)(console);
  }
}

