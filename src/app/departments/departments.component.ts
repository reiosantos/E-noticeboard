import { Component, OnInit } from '@angular/core';
import {User} from '../_models/user';
import {Department} from '../_models/department';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DepartmentService} from '../_services/department.service';
import {AlertService} from '../_services/alert.service';
import {isBoolean, isNullOrUndefined} from 'util';
import {environment} from '../../environments/environment.prod';

@Component({
	selector: 'app-departments',
	templateUrl: './departments.component.html',
	styleUrls: ['./departments.component.css']
})
export class DepartmentsComponent implements OnInit {
	user: User;
	modalDepartment: Department;
	addDepartmentForm: FormGroup;

	loading = false;
	departmentSubmitted = false;
	departments: any = [];

	tempDepartment: Department[] = [];
	searchTerm: string;
	searchForm: FormGroup;
	constructor(
		private alertService: AlertService,
		private departmentService: DepartmentService,
		private fb: FormBuilder
	) {
		this.user = JSON.parse(localStorage.getItem(environment.userStorageKey));
		this.addDepartmentForm = fb.group({
			name: ['', Validators.compose([Validators.required])],
			head: ['', Validators.compose([Validators.required])],
		});
		this.searchForm = fb.group({ search: [''] });
		this.modalDepartment = new Department();
	}

	ngOnInit() {
		this.refreshDepartments();
	}

	departmentSubmit() {
		this.departmentSubmitted = true;
		if (this.addDepartmentForm.valid) {
			this.loading = true;
			const us = new Department();
			us.head = this.addDepartmentForm.controls.head.value;
			us.name = this.addDepartmentForm.controls.name.value;
			if (this.modalDepartment) {
				us.id = this.modalDepartment.id;
			}
			this.departmentService.createOrUpdate(us).subscribe(
				data => {
					if (!data) {
						this.alertService.error('Internal Server Error. Consult the administrator.');
					}else if (!isNullOrUndefined(data.data) && data.data) {
						if (this.modalDepartment) {
							this.alertService.success('Department has been modified...', false);
						}else {
							this.alertService.success('new department has been added...', false);
						}
						this.addDepartmentForm.reset('');
						this.departmentSubmitted = false;
						this.modalDepartment = new Department();
						this.refreshDepartments();
					}else {
						this.alertService.error('Unable to add department...Try again');
					}
					this.loading = false;
				},
				error => {
					this.alertService.error('Unable to save deartment...');
					this.loading = false;
				});
		}
	}

	editDepartment(c: Department) {
		this.modalDepartment = c;
	}

	searchItems() {
		this.searchTerm = this.searchForm.controls.search.value;
		const temp: Department[] = [];
		for (let i = 0; i < this.tempDepartment.length; i++) {
			const note = this.tempDepartment[i];
			if ((note.name.toLowerCase()).search(this.searchTerm.toLowerCase()) >= 0) {
				temp.push(note);
			}
		}
		this.departments = temp;
	}

	deleteDepartment(c: Department) {
		if (confirm('Are You sure To Delete This Department ?')) {
			this.loading = true;
			this.departmentService.delete(c.id).subscribe(
				data => {
					if (data && !isNullOrUndefined(data.data) && data.data) {
						this.refreshDepartments();
						this.alertService.success('Department has been deleted...', false);
					}else {
						this.alertService.error('Sorry... Error occurred Unable to delete Department');
					}
					this.loading = false;
				},
				error => {
					this.alertService.error('Sorry... Error occurred Unable to delete Department');
					this.loading = false;
				}
			);
		}
	}

	refreshDepartments() {
		this.departmentService.getAll().subscribe(
			data => {
				if (data && !isNullOrUndefined(data.data) && data.data && !isBoolean(data.data)) {
					this.departments = data.data;
					this.tempDepartment = data.data;
				}
			},
		);
	}

}
