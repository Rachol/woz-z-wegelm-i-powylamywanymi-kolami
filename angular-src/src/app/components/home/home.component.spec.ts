/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HomeComponent } from './home.component';

import { RouterLinkStubDirective } from '../../../testing/router-stubs';

let component: HomeComponent;
let fixture: ComponentFixture<HomeComponent>;

describe('HomeComponent', () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
        declarations: [
            HomeComponent,
            RouterLinkStubDirective
        ],
        schemas: []
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        });
    tests();

});

function tests() {
    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('contains required routerLinks in template', () => {
        const links = fixture.debugElement.queryAll(By.directive(RouterLinkStubDirective))
            .map(de => de.injector.get(RouterLinkStubDirective).params);
        expect(links.length).toBe(2, 'should have 2 links');
        expect(links).toContain('/register', 'should contain link to register page');
        expect(links).toContain('/login', 'should contain link to login page');
    });
}

