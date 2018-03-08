import {Component, OnDestroy, OnInit} from '@angular/core';
import {isBoolean, isNullOrUndefined} from 'util';
import {UpshotService} from '../_services/upshot.service';
import {NoticeService} from '../_services/notice.service';
import {environment} from '../../environments/environment.prod';
import {User} from '../_models/user';
import {Upshot} from '../_models/upshot';
import {Notice} from '../_models/notice';
import {Observable} from 'rxjs/Observable';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

	user: User = null;
	events: Upshot[] = [];
	notices: Notice[] = [];

	timerSubscription: any;
	timerSubscription1: any;

	tempNotices: Notice[] = [];
	tempFilterNotices: Notice[] = [];
	searchFilter = 'all';
	searchTerm: string;
	searchForm: FormGroup;

	eventsClass = 'col-md-6';
	notesClass = 'col-md-6';

	constructor(
		private eventService: UpshotService,
		private noticeService: NoticeService,
		private fb: FormBuilder
	) {
		if (localStorage.getItem(environment.userStorageKey) !== null) {
			this.user = JSON.parse(localStorage.getItem(environment.userStorageKey));
		}
		this.searchForm = fb.group({ search: [''] });
	}

	ngOnInit() {
		this.refreshEvents();
		this.refreshNotices();
	}

	ngOnDestroy() {
		if (this.timerSubscription) {
			this.timerSubscription.unsubscribe();
		}
		if (this.timerSubscription1) {
			this.timerSubscription1.unsubscribe();
		}
	}

	searchItems() {
		this.searchTerm = this.searchForm.controls.search.value;
		const temp: Notice[] = [];
		for (let i = 0; i < this.tempNotices.length; i++) {
			const note = this.tempNotices[i];
			if ((note.title.toLowerCase()).search(this.searchTerm.trim().toLowerCase()) >= 0 ||
				(note.programme_code.toLowerCase()).search(this.searchTerm.trim().toLowerCase()) >= 0 ||
				(note.level.toLowerCase()).search(this.searchTerm.trim().toLowerCase()) >= 0 ||
				(note.programme_name.toLowerCase()).search(this.searchTerm.trim().toLowerCase()) >= 0) {
				temp.push(note);
			}
		}
		this.notices = temp;
	}

	filterItems() {
		if (this.searchFilter === 'all') {
			this.notices = this.tempFilterNotices;
			this.tempNotices = this.tempFilterNotices;
			return;
		}
		const temp: Notice[] = [];
		for (let i = 0; i < this.tempFilterNotices.length; i++) {
			const note = this.tempFilterNotices[i];
			if (note.category !== null) {
				if ((note.category.toLowerCase()) === this.searchFilter.trim().toLowerCase()) {
					temp.push(note);
				}
			}
		}
		this.notices = temp;
		this.tempNotices = temp;
	}

	refreshEvents() {
		this.eventService.getAll(this.user).subscribe(
			data => {
				if (data && !isNullOrUndefined(data.data) && data.data && !isBoolean(data.data)) {
					this.events = data.data;
				}else {
					this.events = [];
				}
				if (this.notices.length > 0 && this.events.length === 0) {
					this.notesClass = 'col-md-12';
				}else if (this.notices.length === 0 && this.events.length === 0) {
					this.notesClass = 'col-md-12';
				}else if (this.notices.length === 0 && this.events.length > 0) {
					this.notesClass = '';
					this.eventsClass = 'col-md-12';
				}else {
					this.notesClass = 'col-md-6';
					this.eventsClass = 'col-md-6';
				}
				this.subscribeToEData();
			},
		);
	}

	private subscribeToData(): void {
		this.timerSubscription = Observable.timer(300000).first().subscribe(() => this.refreshNotices());
	}

	private subscribeToEData(): void {
		this.timerSubscription1 = Observable.timer(300000).first().subscribe(() => this.refreshEvents());
	}

	refreshNotices() {
		this.noticeService.getAll(this.user).subscribe(
			data => {
				if (data && !isNullOrUndefined(data.data) && data.data && !isBoolean(data.data)) {
					this.notices = data.data;
					this.tempNotices = data.data;
					this.tempFilterNotices = data.data;
					this.searchFilter = 'all';
				}
				if (this.notices.length > 0 && this.events.length === 0) {
					this.notesClass = 'col-md-12';
				}else if (this.notices.length === 0 && this.events.length === 0) {
					this.notesClass = 'col-md-12';
				}else if (this.notices.length === 0 && this.events.length > 0) {
					this.notesClass = '';
					this.eventsClass = 'col-md-12';
				}else {
					this.notesClass = 'col-md-6';
					this.eventsClass = 'col-md-6';
				}
				this.subscribeToData();
			},
		);
	}
}
