import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

    constructor(private authService: AuthService,
                private router: Router,
                private flashMessagesService: FlashMessagesService) { }

    ngOnInit() {
    }

    onLogoutClick() {
        this.authService.logoutUser();
        this.flashMessagesService.show('You are now logged out', {cssClass: 'alert-success', timeout: 3000});
        this.router.navigate(['/login']);
        return false; // Return false, so that the html link in <a> has no effect.
    }

}
