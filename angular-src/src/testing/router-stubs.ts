import { Component, Directive, Input } from '@angular/core';
import { NavigationExtras } from '@angular/router';

@Directive({selector: '[routerLink]'})
export class RouterLinkStubDirective {
    @Input('routerLink') params: any;
}

@Directive({selector: '[routerLinkActive]'})
export class RouterLinkActiveStubDirective {
    @Input('routerLinkActive') params: any;
}

