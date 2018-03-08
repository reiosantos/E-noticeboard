import {Component, OnDestroy, OnInit} from '@angular/core';
import { Location } from '@angular/common';
import {User} from './_models/user';
import {AuthenticationService} from './_services/authentication.service';
import {Router} from '@angular/router';
import {environment} from '../environments/environment.prod';
import {isBoolean, isNullOrUndefined} from 'util';
import {MainService} from './_services/main.service';
import {Observable} from 'rxjs/Observable';
import {NoticeService} from './_services/notice.service';
import {Notice} from './_models/notice';
import {SharedService} from './_services/shared.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy, OnInit {
	title = 'app';
	date_today = new Date();
	no_of_courses = 0;
	no_of_students = 0;
	no_of_lecturers = 0;
	no_of_new_events = 0;
	no_of_programmes = 0;
	user: User = null;
	isLoggedin = false;

	notices: Notice[] = [];

	timerSubscription: any;
	noticeSubscription: any;

	constructor(
		public router: Router,
		private authService: AuthenticationService,
		private mainService: MainService,
		private location: Location,
		private noticeService: NoticeService,
		private _sharedService: SharedService,
	) {
		if (localStorage.getItem(environment.userStorageKey) !== null) {
			this.user = JSON.parse(localStorage.getItem(environment.userStorageKey));
		}
		this.isLoggedin = !!this.user;
		_sharedService.changeEmitted$.subscribe(
			status => {
				if (status) {
					document.getElementById('login_notify').click();
				}
			}
		);
	}

	ngOnInit() {
		this.refreshMain();
		/*if (this.user) {
			this.refreshNotices();
		}*/
		this.refreshNotices();
	}

	ngOnDestroy(): void {
		if (this.timerSubscription) {
			this.timerSubscription.unsubscribe();
		}
		if (this.noticeSubscription) {
			this.noticeSubscription.unsubscribe();
		}
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

	private subscribeToData(): void {
		this.timerSubscription = Observable.timer(300000).first().subscribe(() => this.refreshMain());
	}
	private subscribeToNoticeData(): void {
		this.noticeSubscription = Observable.timer(200000).first().subscribe(() => this.refreshNotices());
	}

	refreshMain() {
		this.mainService.getAll().subscribe(
			data => {
				if (data && !isNullOrUndefined(data.data) && data.data && !isBoolean(data.data)) {
					const summary = data.data;
					this.no_of_courses = parseInt(summary['no_of_courses'], 10);
					this.no_of_students = parseInt(summary['no_of_students'], 10);
					this.no_of_lecturers = parseInt(summary['no_of_lecturers'], 10);
					this.no_of_new_events = parseInt(summary['no_of_new_events'], 10);
					this.no_of_programmes = parseInt(summary['no_of_programmes'], 10);
				}
				this.subscribeToData();
			},
		);
	}

	refreshNotices() {
		this.noticeService.getUrgent(this.user, true).subscribe(
			data => {
				if (data && !isNullOrUndefined(data.data) && data.data && !isBoolean(data.data)) {
					this.notices = data.data;
				}
				this.subscribeToNoticeData();
			},
		);
	}
}
