import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorviewComponent } from './editorview.component';

describe('EditorviewComponent', () => {
  let component: EditorviewComponent;
  let fixture: ComponentFixture<EditorviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
