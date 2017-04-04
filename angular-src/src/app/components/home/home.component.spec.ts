/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HomeComponent } from './home.component';

import { RouterLinkStubDirective } from '../../../testing/router-stubs';

let component: HomeComponent;
let fixture: ComponentFixture<HomeComponent>;
    let links: RouterLinkStubDirective[];
    let linkDes: DebugElement[];

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
        linkDes = fixture.debugElement.queryAll(By.directive(RouterLinkStubDirective));
        links = linkDes.map(de => de.injector.get(RouterLinkStubDirective) as RouterLinkStubDirective);
        fixture.detectChanges();
        });
    tests();

});

function tests() {
    
    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('can get RouterLinks from template', () => {
        expect(links.length).toBe(2, 'should have 2 links');
        expect(links[0].linkParams).toBe('/register', '1st link should go to Register');
        expect(links[1].linkParams).toBe('/login', '2nd link should go to Login');
    });

    it('can click Register link in template', () => {
        const registerDe = linkDes[0];
        const registerLink = links[0];

        expect(registerLink.navigatedTo).toBeNull('link should not have navigated yet');

        registerDe.triggerEventHandler('click', null);
        fixture.detectChanges();

        expect(registerLink.navigatedTo).toBe('/register');
    });

    it('can click Login link in template', () => {
        const loginDe = linkDes[1];
        const loginLink = links[1];

        expect(loginLink.navigatedTo).toBeNull('link should not have navigated yet');

        loginDe.triggerEventHandler('click', null);
        fixture.detectChanges();

        expect(loginLink.navigatedTo).toBe('/login');
    });
}

