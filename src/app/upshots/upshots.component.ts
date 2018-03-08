import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {User} from '../_models/user';
import {AlertService} from '../_services/alert.service';
import {UpshotService} from '../_services/upshot.service';
import {isBoolean, isNullOrUndefined} from 'util';
import {Upshot} from '../_models/upshot';
import {environment} from '../../environments/environment.prod';
import {SharedService} from '../_services/shared.service';

@Component({
	selector: 'app-upshots',
	templateUrl: './upshots.component.html',
	styleUrls: ['./upshots.component.css']
})
export class UpshotsComponent implements OnInit {
	user: User = null;
	addEvent = true;
	loading = false;
	addEventForm: FormGroup;
	modalEvent: Upshot;
	eventSubmitted = false;
	events: any = [];
	ext = 'jpg';
	image = false;

	constructor(
		private alertService: AlertService,
		private eventService: UpshotService,
		private fb: FormBuilder,
		private _sharedService: SharedService,
	) {
		if (localStorage.getItem(environment.userStorageKey) !== null) {
			this.user = JSON.parse(localStorage.getItem(environment.userStorageKey));
		}
		this.addEventForm = fb.group({
			title: ['', Validators.compose([Validators.required])],
			subtitle: [''],
			image_file: [''],
			description: ['', Validators.compose([Validators.required])],
			event_date: ['', Validators.compose([Validators.required])],
		});
		this.modalEvent = new Upshot();
	}

	ngOnInit() {
		this.refreshEvents();
	}

	emitLogin() {
		this._sharedService.emitChange(true);
	}

	eventSubmit() {
		if (this.user === null || this.user.name === null) {
			alert('You are not logged in.Please login first');
			return;
		}
		this.eventSubmitted = true;
		if (this.addEventForm.valid) {
			this.loading = true;
			const us = new Upshot();
			us.title = this.addEventForm.controls.title.value;
			us.subtitle = this.addEventForm.controls.subtitle.value;
			us.description = this.addEventForm.controls.description.value;
			us.event_date = this.addEventForm.controls.event_date.value;
			us.file = this.addEventForm.controls.image_file.value;
			us.posted_by = this.user.name;
			if (this.modalEvent) {
				us.id = this.modalEvent.id;
			}
			us.post_date = environment.generateDate();
			if (us.file.trim() !== '') {
				us.file_name = this.generateFileName(us);
			}else{
				us.file_name = '';
			}

			this.eventService.createOrUpdate(us).subscribe(
				data => {
					if (!data) {
						this.alertService.error('Internal Server Error. Consult the administrator.');
					}else if (!isNullOrUndefined(data.data) && data.data) {
						if (this.modalEvent) {
							this.alertService.success('Activity has been modified...', false);
						}else {
							this.alertService.success('new Activity has been posted...', false);
						}
						this.addEventForm.reset('');
						this.eventSubmitted = false;
						this.modalEvent = new Upshot();
						this.refreshEvents();
					}else {
						this.alertService.error('Unable to post Activity....Try again');
					}
					this.loading = false;
				},
				error => {
					this.alertService.error('Unable to save Activity...');
					this.loading = false;
				});
		}
	}

	onFileChange(event) {
		if (event.target.files.length > 0) {
			const files = event.target.files;
			const file = files[0];

			if (files && file) {
				if (!file.type.match('image.*')) {
					alert('Not an image file, it won\'t be uploaded');
					return false;
				}
				if (file.size > ( 1024 * 1024 * 5)) { // checking for 2MB maximum
					alert('File is too large... 5MB maximum');
					return false;
				}
				const reader = new FileReader();
				reader.onload = () => {
					const binaryString = reader.result;
					this.image = true;
					this.addEventForm.controls['image_file'].setValue(binaryString);
				};
				reader.onerror = () => {
					console.log('there are some problems');

				};
				reader.readAsDataURL(file);
			}
		}
	}

	editEvent(e: Upshot) {
		this.modalEvent = e;
	}

	generateFileName(us: Upshot): string {
		return (us.title.replace(' ', '_') + '_' +
			(us.post_date.replace(' ', '_')).replace('-', '_'))
			.replace(':', '_') + '.' + this.ext;
	}

	deleteEvent(e: Upshot) {
		if (confirm('Are You sure To Delete This Event ?')) {
			this.loading = true;
			this.eventService.delete(e.id).subscribe(
				data => {
					if (data && !isNullOrUndefined(data.data) && data.data) {
						this.refreshEvents();
						this.alertService.success('Event has been deleted...', false);
					}else {
						this.alertService.error('Sorry... Error occurred Unable to delete Event');
					}
					this.loading = false;
				},
				error => {
					this.alertService.error('Sorry... Error occurred Unable to delete Event');
					this.loading = false;
				}
			);
		}
	}

	refreshEvents() {
		this.eventService.getAll(this.user).subscribe(
			data => {
				if (data && !isNullOrUndefined(data.data) && data.data && !isBoolean(data.data)) {
					this.events = data.data;
				}else {
					this.events = [];
				}
			},
		);
	}

	loadArchives() {
		this.eventService.getArchives(this.user).subscribe(
			data => {
				if (data && !isNullOrUndefined(data.data) && data.data && !isBoolean(data.data)) {
					this.events = data.data;
				}
			},
		);
	}

}
