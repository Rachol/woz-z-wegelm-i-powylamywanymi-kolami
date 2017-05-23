import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ScriptService } from '../../services/script.service';

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
  // aceOptions: any = {maxLines: 1000, printMargin: false};

  constructor(elementRef: ElementRef,
              private scriptService: ScriptService) {

    const el = elementRef.nativeElement;
    this.editor = ace['edit'](el);
    // this.editor.setOptions(this.aceOptions);
    const me = this;
    const editor = this.editor;
    editor.setTheme('ace/theme/twilight');
    editor.getSession().setMode('ace/mode/javascript');
    editor.setReadOnly(false);

    this.scriptService.getEditorContent().subscribe( data => {
      editor.setValue(data.editor);
    });
/*
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
 */
    // editor.getSession().on('change', function(e) {
    // me.onChange(e);
    // });

    editor.commands.addCommand({
      name: 'myCommand',
      bindKey: {win: 'Ctrl-S',  mac: 'Command-S'},
      exec: function(edit) {
        try{
          me.evaluate(edit.getValue());
          me.onChange(edit);
        }catch(err){
          // do nothing, just want to check if the thing compiles
          console.log(err.stack);
        }
      },
      readOnly: true // false if this command should not apply in readOnly mode
    });

  }

  ngOnInit() {
  }

  onChange(code) {
    const editorData = this.editor.getValue();
    // here we can start saving shit...
    console.log(editorData);
    this.scriptService.saveEditorContent(editorData).subscribe();
  }

  private evaluate(str: string) {
    return eval(`(function(console) {${str}})`)(console);
  }
}

