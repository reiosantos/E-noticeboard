import { Component, OnInit } from '@angular/core';
import {User} from '../_models/user';
import {Lecturer} from '../_models/lecturer';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertService} from '../_services/alert.service';
import {LecturerService} from '../_services/lecturer.service';
import {isBoolean, isNullOrUndefined} from 'util';
import {EmailValidator} from '../../validators/email';
import {environment} from '../../environments/environment.prod';
import {Department} from '../_models/department';
import {Room} from '../_models/room';
import {RoomService} from '../_services/room.service';
import {DepartmentService} from '../_services/department.service';

@Component({
	selector: 'app-lecturers',
	templateUrl: './lecturers.component.html',
	styleUrls: ['./lecturers.component.css']
})
export class LecturersComponent implements OnInit {

	user: User = null;
	modalLecturer: Lecturer;
	addLecturerForm: FormGroup;

	loading = false;
	lecturerSubmitted = false;
	lecturers: any = [];

	tempLecturers: Lecturer[] = [];
	departments: Department[] = [];
	rooms: Room[] = [];
	searchTerm: string;
	searchForm: FormGroup;
	constructor(
		private alertService: AlertService,
		private lecturerService: LecturerService,
		private roomService: RoomService,
		private departmentService: DepartmentService,
		private fb: FormBuilder
	) {
		if (localStorage.getItem(environment.userStorageKey) !== null) {
			this.user = JSON.parse(localStorage.getItem(environment.userStorageKey));
		}
		this.addLecturerForm = fb.group({
			first_name: ['', Validators.compose([Validators.required])],
			last_name: ['', Validators.compose([Validators.required])],
			email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
			contact: ['', Validators.compose([Validators.required])],
			room_id: ['', Validators.compose([Validators.required])],
			department_id: ['', Validators.compose([Validators.required])],
		});
		this.searchForm = fb.group({ search: [''] });
		this.modalLecturer = new Lecturer();
	}

	ngOnInit() {
		this.refreshLecturers();
		this.refreshDepartments();
		this.refreshRooms();
	}

	editLecturer(c: Lecturer) {
		this.modalLecturer = c;
	}

	searchItems() {
		this.searchTerm = this.searchForm.controls.search.value;
		const temp: Lecturer[] = [];
		for (let i = 0; i < this.tempLecturers.length; i++) {
			const note = this.tempLecturers[i];
			if ((note.first_name.toLowerCase()).search(this.searchTerm.trim().toLowerCase()) >= 0 ||
				(note.department_name.toLowerCase()).search(this.searchTerm.trim().toLowerCase()) >= 0 ||
				(note.contact.toLowerCase()).search(this.searchTerm.trim().toLowerCase()) >= 0 ||
				(note.email.toLowerCase()).search(this.searchTerm.trim().toLowerCase()) >= 0 ||
				(note.last_name.toLowerCase()).search(this.searchTerm.trim().toLowerCase()) >= 0
			) {
				temp.push(note);
			}
		}
		this.lecturers = temp;
	}

	lecturerSubmit() {
		this.lecturerSubmitted = true;
		if (this.addLecturerForm.valid) {
			this.loading = true;
			const us = new Lecturer();
			us.first_name = this.addLecturerForm.controls.first_name.value;
			us.last_name = this.addLecturerForm.controls.last_name.value;
			us.email = this.addLecturerForm.controls.email.value;
			us.contact = this.addLecturerForm.controls.contact.value;
			us.room_id = this.addLecturerForm.controls.room_id.value;
			us.department_id = this.addLecturerForm.controls.department_id.value;
			if (this.modalLecturer) {
				us.id = this.modalLecturer.id;
			}
			this.lecturerService.createOrUpdate(us).subscribe(
				data => {
					if (!data) {
						this.alertService.error('Internal Server Error. Consult the administrator.');
					}else if (!isNullOrUndefined(data.data) && data.data) {
						if (this.modalLecturer) {
							this.alertService.success('Lecturer info has been modified...', false);
						}else {
							this.alertService.success('Lecturer has been added...', false);
						}
						this.addLecturerForm.reset('');
						this.lecturerSubmitted = false;
						this.modalLecturer = new Lecturer();
						this.refreshLecturers();
					}else {
						this.alertService.error('Unable to add lecturer....Try again');
					}
					this.loading = false;
				},
				error => {
					this.alertService.error('Unable to save lecturer...');
					this.loading = false;
				});
		}
	}

	deleteLecturer(c: Lecturer) {
		if (confirm('Are You sure To Delete Lecturer ?')) {
			this.loading = true;
			this.lecturerService.delete(c.id).subscribe(
				data => {
					if (data && !isNullOrUndefined(data.data) && data.data) {
						this.refreshLecturers();
						this.alertService.success('Lecturer has been deleted...', false);
					}else {
						this.alertService.error('Sorry... Error occurred Unable to delete Lecturer');
					}
					this.loading = false;
				},
				error => {
					this.alertService.error('Sorry... Error occurred Unable to delete Lecturer');
					this.loading = false;
				}
			);
		}
	}

	refreshLecturers() {
		this.lecturerService.getAll().subscribe(
			data => {
				if (data && !isNullOrUndefined(data.data) && data.data && !isBoolean(data.data)) {
					this.lecturers = data.data;
					this.tempLecturers = data.data;
				}
			},
		);
	}

	refreshDepartments() {
		this.departmentService.getAll().subscribe(
			data => {
				if (data && !isNullOrUndefined(data.data) && data.data && !isBoolean(data.data)) {
					this.departments = data.data;
				}
			}, error => {
				console.log(error);
			}
		);
	}

	refreshRooms() {
		this.roomService.getAll().subscribe(
			data => {
				if (data && !isNullOrUndefined(data.data) && data.data && !isBoolean(data.data)) {
					this.rooms = data.data;
				}
			},
		);
	}
}
