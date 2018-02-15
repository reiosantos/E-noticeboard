import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {User} from '../_models/user';
import {AlertService} from '../_services/alert.service';
import {UpshotService} from '../_services/upshot.service';
import {isBoolean, isNullOrUndefined} from 'util';
import {Upshot} from '../_models/upshot';

@Component({
	selector: 'app-upshots',
	templateUrl: './upshots.component.html',
	styleUrls: ['./upshots.component.css']
})
export class UpshotsComponent implements OnInit {

	user: User;
	addEvent = true;
	loading = false;
	addEventForm: FormGroup;
	modalEvent: Upshot;
	eventSubmitted = false;
	events: any = [];
	constructor(
		private alertService: AlertService,
		private eventService: UpshotService,
		private fb: FormBuilder
	) {
		this.user = JSON.parse(localStorage.getItem('currentUser'));
		this.addEventForm = fb.group({
			title: ['', Validators.compose([Validators.required])],
			subtitle: [''],
			image_file: null,
			description: ['', Validators.compose([Validators.required])],
			event_date: ['', Validators.compose([Validators.required])],
		});
		this.modalEvent = new Upshot();
	}

	ngOnInit() {
		this.refreshEvents();
	}

	eventSubmit() {
		this.eventSubmitted = true;
		if (this.addEventForm.valid) {
			this.loading = true;
			const us = new Upshot();
			us.title = this.addEventForm.controls.title.value;
			us.subtitle = this.addEventForm.controls.subtitle.value;
			us.description = this.addEventForm.controls.descriprion.value;
			us.event_date = this.addEventForm.controls.event_date.value;
			us.file = this.addEventForm.controls.image_file.value;
			us.user_id = this.user.id;
			if (this.modalEvent) {
				us.id = this.modalEvent.id;
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
			const file = event.target.files[0];
			this.addEventForm.get('image_file').setValue(file);
		}
	}

	editEvent(e: Upshot) {
		this.modalEvent = e;
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
		this.eventService.getAll().subscribe(
			data => {
				if (data && !isNullOrUndefined(data.data) && data.data && !isBoolean(data.data)) {
					this.events = data.data;
				}
			},
		);
	}
}
