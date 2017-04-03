/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
    let component: DashboardComponent;
    let fixture: ComponentFixture<DashboardComponent>;
    let el_h2: HTMLElement;
    let el_p: HTMLElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ DashboardComponent ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DashboardComponent);
        component = fixture.componentInstance;
        el_h2 = fixture.debugElement.query(By.css('h2')).nativeElement;
        el_p = fixture.debugElement.query(By.css('p')).nativeElement;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display Dashboard text in the title', () => {
        expect(el_h2.textContent).toContain('Dashboard');
    });

    it('should contain Welcome text in the paragraph', () => {
        expect(el_p.textContent).toContain('Welcome');
    });

});
