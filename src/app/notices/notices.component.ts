import {Component, OnDestroy, OnInit} from '@angular/core';
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

@Component({
	selector: 'app-notices',
	templateUrl: './notices.component.html',
	styleUrls: ['./notices.component.css']
})
export class NoticesComponent implements OnInit, OnDestroy {
	user: User;
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
	searchTerm: string;
	searchForm: FormGroup;
	constructor(
		private alertService: AlertService,
		private noticeService: NoticeService,
		private programmeService: ProgrammeService,
		private fb: FormBuilder
	) {
		this.user = JSON.parse(localStorage.getItem(environment.userStorageKey));
		this.addNoticeForm = fb.group({
			title: ['', Validators.compose([Validators.required])],
			description: ['', Validators.compose([Validators.required])],
			programme_id: ['', Validators.compose([Validators.required])],
		});
		this.searchForm = fb.group({ search: [''] });
		this.modalNotice = new Notice();
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

	noticeSubmit() {
		this.noticeSubmitted = true;
		if (this.addNoticeForm.valid) {
			this.loading = true;
			const us = new Notice();
			us.title = this.addNoticeForm.controls.title.value;
			us.descriptiion = this.addNoticeForm.controls.description.value;
			if (this.modalNotice) {
				us.id = this.modalNotice.id;
			}
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
			if ((note.title.toLowerCase()).search(this.searchTerm.toLowerCase()) >= 0) {
				temp.push(note);
			}
		}
		this.notices = temp;
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
		this.noticeService.getAll().subscribe(
			data => {
				if (data && !isNullOrUndefined(data.data) && data.data && !isBoolean(data.data)) {
					this.notices = data.data;
					this.tempNotices = data.data;
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
}
