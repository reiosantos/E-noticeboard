import { Component } from '@angular/core';
import { Location } from '@angular/common';
import {User} from './_models/user';
import {AuthenticationService} from './_services/authentication.service';
import {Router} from '@angular/router';
import {environment} from '../environments/environment.prod';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	title = 'app';
	date_today = new Date();
	no_of_courses = 0;
	no_of_students = 0;
	no_of_lecturers = 0;
	no_of_new_events = 0;
	no_of_programmes = 0;
	user: User = null;
	isLoggedin = false;

	constructor(
		public router: Router,
		private authService: AuthenticationService,
		private location: Location
	) {
		if (localStorage.getItem(environment.userStorageKey) !== null) {
			this.user = JSON.parse(localStorage.getItem(environment.userStorageKey));
		}
		this.isLoggedin = !!this.user;
	}

	loginEmit(status) {
		this.isLoggedin = status;
		this.user = JSON.parse(localStorage.getItem(environment.userStorageKey));
		if (this.isLoggedin) {
			location.reload();
		}
	}

	logout() {
		this.authService.logout();
		this.isLoggedin = false;
		location.reload();
	}
}
