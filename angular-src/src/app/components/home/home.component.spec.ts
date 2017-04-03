/* tslint:disable:no-unused-variable */
import { NO_ERRORS_SCHEMA } from '@angular/core';
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
        schemas: [NO_ERRORS_SCHEMA]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        });
    htmlTests();
    routerTests();

});

function htmlTests() {
    let el_h1: HTMLElement;
    let el_p: HTMLElement;

     beforeEach(() => {
        // trigger initial data binding
        fixture.detectChanges();

        // get html elements of interest
        el_h1 = fixture.debugElement.query(By.css('h1')).nativeElement;
        el_p = fixture.debugElement.query(By.css('p')).nativeElement;
        });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display [Woz, z, weglem] texts in the title', () => {
        expect(el_h1.textContent).toContain('Woz');
        expect(el_h1.textContent).toContain('z');
        expect(el_h1.textContent).toContain('weglem');
    });

    it('should contain Welcome text in the paragraph', () => {
        expect(el_p.textContent).toContain('Welcome');
    });
}

function routerTests() {
    let links: RouterLinkStubDirective[];
    let linkDes: DebugElement[];

    beforeEach(() => {
        // trigger initial data binding
        fixture.detectChanges();

        // find DebugElements with an attached RouterLinkStubDirective
        linkDes = fixture.debugElement
            .queryAll(By.directive(RouterLinkStubDirective));

        // get the attached link directive instances using the DebugElement injectors
        links = linkDes
            .map(de => de.injector.get(RouterLinkStubDirective) as RouterLinkStubDirective);
    });

    it('can get RouterLinks from template', () => {
        expect(links.length).toBe(2, 'should have 3 links');
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

