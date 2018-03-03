///<reference path="../../../node_modules/@angular/core/src/metadata/directives.d.ts"/>
import { Component, OnInit } from '@angular/core';
import {User} from '../_models/user';
import {Admin} from '../_models/admin';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertService} from '../_services/alert.service';
import {AdminService} from '../_services/admin.service';
import {isBoolean, isNullOrUndefined} from 'util';
import {environment} from '../../environments/environment.prod';
import {EmailValidator} from '../../validators/email';

@Component({
	selector: 'app-admin',
	templateUrl: './admin.component.html',
	styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

	user: User;
	modalAdmin: Admin;
	addAdminForm: FormGroup;

	loading = false;
	adminSubmitted = false;
	admins: Admin[] = [];

	tempAdmins: Admin[] = [];
	searchTerm: string;
	searchForm: FormGroup;
	constructor(
		private alertService: AlertService,
		private adminService: AdminService,
		private fb: FormBuilder
	) {
		this.user = JSON.parse(localStorage.getItem(environment.userStorageKey));
		this.addAdminForm = fb.group({
			first_name: ['', Validators.compose([Validators.required])],
			last_name: ['', Validators.compose([Validators.required])],
			email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
			contact: ['', Validators.compose([Validators.required])],
			password: ['', Validators.compose([Validators.required])],
		});
		this.searchForm = fb.group({ search: [''] });
		this.modalAdmin = new Admin();
	}

	ngOnInit() {
		this.refreshAdmins();
	}

	editAdmin(c: Admin) {
		this.modalAdmin = c;
	}

	searchItems() {
		this.searchTerm = this.searchForm.controls.search.value;
		const temp: Admin[] = [];
		for (let i = 0; i < this.tempAdmins.length; i++) {
			const note = this.tempAdmins[i];
			if ((note.first_name.toLowerCase()).search(this.searchTerm.toLowerCase()) >= 0 ||
				(note.last_name.toLowerCase()).search(this.searchTerm.toLowerCase()) >= 0
			) {
				temp.push(note);
			}
		}
		this.admins = temp;
	}

	adminSubmit() {
		this.adminSubmitted = true;
		if (this.addAdminForm.valid) {
			this.loading = true;
			const us = new Admin();
			us.first_name = this.addAdminForm.controls.first_name.value;
			us.last_name = this.addAdminForm.controls.last_name.value;
			us.email = this.addAdminForm.controls.email.value;
			us.contact = this.addAdminForm.controls.contact.value;
			us.password = this.addAdminForm.controls.password.value;
			if (this.modalAdmin) {
				us.id = this.modalAdmin.id;
			}
			this.adminService.createOrUpdate(us).subscribe(
				data => {
					if (!data) {
						this.alertService.error('Internal Server Error. Consult the administrator.');
					}else if (!isNullOrUndefined(data.data) && data.data) {
						if (this.modalAdmin) {
							this.alertService.success('Admin info has been modified...', false);
						}else {
							this.alertService.success('Admin has been added...', false);
						}
						this.addAdminForm.reset('');
						this.adminSubmitted = false;
						this.modalAdmin = new Admin();
						this.refreshAdmins();
					}else {
						this.alertService.error('Unable to add Admin....Try again');
					}
					this.loading = false;
				},
				error => {
					this.alertService.error('Unable to save Admin...');
					this.loading = false;
				});
		}
	}

	deleteAdmin(c: Admin) {
		if (confirm('Are You sure To Delete Admin ?')) {
			this.loading = true;
			this.adminService.delete(c.id).subscribe(
				data => {
					if (data && !isNullOrUndefined(data.data) && data.data) {
						this.refreshAdmins();
						this.alertService.success('Admin has been deleted...', false);
					}else {
						this.alertService.error('Sorry... Error occurred Unable to delete Admin');
					}
					this.loading = false;
				},
				error => {
					this.alertService.error('Sorry... Error occurred Unable to delete Admin');
					this.loading = false;
				}
			);
		}
	}

	refreshAdmins() {
		this.adminService.getAll().subscribe(
			data => {
				if (data && !isNullOrUndefined(data.data) && data.data && !isBoolean(data.data)) {
					this.admins = data.data;
					this.tempAdmins = data.data;
				}
			},
		);
	}

}
