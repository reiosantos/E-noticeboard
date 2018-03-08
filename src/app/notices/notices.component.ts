import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {User} from '../_models/user';
import {AlertService} from '../_services/alert.service';
import {NoticeService} from '../_services/notice.service';
import {Notice} from '../_models/notice';
import {isBoolean, isNullOrUndefined} from 'util';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/first';
import {environment} from '../../environments/environment.prod';
import {ProgrammeService} from '../_services/programme.service';
import {Programme} from '../_models/programme';
import {SharedService} from '../_services/shared.service';

@Component({
	selector: 'app-notices',
	templateUrl: './notices.component.html',
	styleUrls: ['./notices.component.css']
})
export class NoticesComponent implements OnInit, OnDestroy {
	user: User = null;
	addNotice = true;
	loading = false;
	addNoticeForm: FormGroup;
	modalNotice: Notice;
	noticeSubmitted = false;
	programmes: Programme[] = [];
	notices: any = [];

	noticeSubscription: any;
	timerSubscription: any;

	tempNotices: Notice[] = [];
	tempFilterNotices: Notice[] = [];
	searchFilter = 'all';
	searchTerm: string;
	searchForm: FormGroup;
	constructor(
		private alertService: AlertService,
		private noticeService: NoticeService,
		private programmeService: ProgrammeService,
		private _sharedService: SharedService,
		private fb: FormBuilder
	) {
		if (localStorage.getItem(environment.userStorageKey) !== null) {
			this.user = JSON.parse(localStorage.getItem(environment.userStorageKey));
		}
		this.addNoticeForm = fb.group({
			title: ['', Validators.compose([Validators.required])],
			description: ['', Validators.compose([Validators.required])],
			programme_id: ['', Validators.compose([Validators.required])],
			level: ['', Validators.compose([Validators.required])],
			category: ['', Validators.compose([Validators.required])],
		});
		this.searchForm = fb.group({ search: [''] });
		this.modalNotice = new Notice();
		this.modalNotice.programme_id = 0;
		this.modalNotice.category = 'educational';
		if (this.user !== null && !this.user.is_student) {
			this.modalNotice.level = 'urgent';
		}else {
			this.modalNotice.level = 'normal';
		}
	}

	ngOnInit() {
		this.refreshProgrammes();
		this.refreshNotices();
	}

	ngOnDestroy(): void {
		if (this.noticeSubscription) {
			this.noticeSubscription.unsubscribe();
		}
		if (this.timerSubscription) {
			this.timerSubscription.unsubscribe();
		}
	}

	emitLogin() {
		this._sharedService.emitChange(true);
	}

	noticeSubmit() {
		if (this.user === null || this.user.name === null) {
			alert('You are not logged in.Please login first');
			return;
		}
		this.noticeSubmitted = true;
		if (this.addNoticeForm.valid) {
			this.loading = true;
			const us = new Notice();
			us.title = this.addNoticeForm.controls.title.value;
			us.description = this.addNoticeForm.controls.description.value;
			us.programme_id = this.addNoticeForm.controls.programme_id.value;
			us.level = this.addNoticeForm.controls.level.value;
			us.category = this.addNoticeForm.controls.category.value;
			if (this.modalNotice) {
				us.id = this.modalNotice.id;
			}
			us.posted_by = this.user.name;
			us.post_date = environment.generateDate();

			this.noticeService.createOrUpdate(us).subscribe(
				data => {
					if (!data) {
						this.alertService.error('Internal Server Error. Consult the administrator.');
					}else if (!isNullOrUndefined(data.data) && data.data) {
						if (this.modalNotice) {
							this.alertService.success('Note has been modified...', false);
						}else {
							this.alertService.success('new note has been posted...', false);
						}
						this.addNoticeForm.reset('');
						this.noticeSubmitted = false;
						this.modalNotice = new Notice();
						this.refreshNotices();
					}else {
						this.alertService.error('Unable to post the note....Try again');
					}
					this.loading = false;
				},
				error => {
					this.alertService.error('Unable to save note...');
					this.loading = false;
				});
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

	deleteNotice(e: Notice) {
		if (confirm('Are You sure To Delete This Note ?')) {
			this.loading = true;
			this.noticeService.delete(e.id).subscribe(
				data => {
					if (data && !isNullOrUndefined(data.data) && data.data) {
						this.refreshNotices();
						this.alertService.success('Note has been deleted...', false);
					}else {
						this.alertService.error('Sorry... Error occurred Unable to delete Notice');
					}
					this.loading = false;
				},
				error => {
					this.alertService.error('Sorry... Error occurred Unable to delete Note');
					this.loading = false;
				}
			);
		}
	}

	private subscribeToData(): void {
		this.timerSubscription = Observable.timer(300000).first().subscribe(() => this.refreshNotices());
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
				this.subscribeToData();
			},
		);
	}

	refreshProgrammes() {
		this.programmeService.getAll().subscribe(
			data => {
				if (data && !isNullOrUndefined(data.data) && data.data && !isBoolean(data.data)) {
					this.programmes = data.data;
				}
			},
		);
	}

	loadArchives() {
		this.noticeService.getArchives(this.user).subscribe(
			data => {
				if (data && !isNullOrUndefined(data.data) && data.data && !isBoolean(data.data)) {
					this.notices = data.data;
					this.tempNotices = data.data;
					this.tempFilterNotices = data.data;
					this.searchFilter = 'all';
				}
			},
		);
	}
}
