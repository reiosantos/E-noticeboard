import { Component, OnInit } from '@angular/core';
import {User} from '../_models/user';
import {Student} from '../_models/student';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertService} from '../_services/alert.service';
import {StudentService} from '../_services/student.service';
import {isBoolean, isNullOrUndefined} from 'util';
import {environment} from '../../environments/environment.prod';
import {Programme} from '../_models/programme';
import {ProgrammeService} from '../_services/programme.service';
import {$} from 'protractor';

@Component({
	selector: 'app-students',
	templateUrl: './students.component.html',
	styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {

	user: User = null;
	modalStudent: Student;
	addStudentForm: FormGroup;

	loading = false;
	studentSubmitted = false;
	students: Student[] = [];

	tempStudents: Student[] = [];
	programmes: Programme[] = [];
	searchTerm: string;
	searchForm: FormGroup;
	constructor(
		private alertService: AlertService,
		private studentService: StudentService,
		private programmeService: ProgrammeService,
		private fb: FormBuilder
	) {
		if (localStorage.getItem(environment.userStorageKey) !== null) {
			this.user = JSON.parse(localStorage.getItem(environment.userStorageKey));
		}
		this.addStudentForm = fb.group({
			full_name: ['', Validators.compose([Validators.required])],
			student_no: ['', Validators.compose([Validators.required])],
			registration_no: ['', Validators.compose([Validators.required])],
			programme_id: ['', Validators.compose([Validators.required])],
		});
		this.searchForm = fb.group({ search: [''] });
		this.modalStudent = new Student();
	}

	validateRegNo(reg_no) {
		const r = new RegExp(/^[\d]+\/U\/[\d]+(\/[\w]+)?$/);
		return r.test(reg_no);
	}

	validateNo(reg_no) {
		const r = new RegExp(/^[\d]+$/);
		return r.test(reg_no);
	}

	ngOnInit() {
		this.refreshStudents();
		this.refreshProgrammes();
	}

	editStudent(c: Student) {
		this.modalStudent = c;
	}

	searchItems() {
		this.searchTerm = this.searchForm.controls.search.value;
		const temp: Student[] = [];
		for (let i = 0; i < this.tempStudents.length; i++) {
			const note = this.tempStudents[i];
			if ((note.full_name.toLowerCase()).search(this.searchTerm.trim().toLowerCase()) >= 0 ||
				(note.registration_no.toLowerCase()).search(this.searchTerm.trim().toLowerCase()) >= 0 ||
				(note.student_no.toLowerCase()).search(this.searchTerm.trim().toLowerCase()) >= 0 ||
				(note.programme_name.toLowerCase()).search(this.searchTerm.trim().toLowerCase()) >= 0 ||
				(note.programme_code.toLowerCase()).search(this.searchTerm.trim().toLowerCase()) >= 0
			) {
				temp.push(note);
			}
		}
		this.students = temp;
	}

	studentSubmit() {
		if (!this.validateRegNo(this.addStudentForm.controls.registration_no.value)) {
			this.addStudentForm.controls.registration_no.setErrors({'errors': true});
		}
		if (!this.validateNo(this.addStudentForm.controls.student_no.value)) {
			this.addStudentForm.controls.student_no.setErrors({'errors': true});
		}
		this.studentSubmitted = true;
		if (this.addStudentForm.valid) {
			this.loading = true;
			const us = new Student();
			us.full_name = this.addStudentForm.controls.full_name.value;
			us.student_no = this.addStudentForm.controls.student_no.value;
			us.registration_no = this.addStudentForm.controls.registration_no.value;
			us.registration_no = this.addStudentForm.controls.registration_no.value;
			us.programme_id = this.addStudentForm.controls.programme_id.value;
			if (this.modalStudent) {
				us.id = this.modalStudent.id;
			}
			this.studentService.createOrUpdate(us).subscribe(
				data => {
					if (!data) {
						this.alertService.error('Internal Server Error. Consult the administrator.');
					}else if (!isNullOrUndefined(data.data) && data.data) {
						if (this.modalStudent) {
							this.alertService.success('Student info has been modified...', false);
						}else {
							this.alertService.success('Student has been added...', false);
						}
						this.addStudentForm.reset('');
						this.studentSubmitted = false;
						this.modalStudent = new Student();
						this.refreshStudents();
					}else {
						this.alertService.error('Unable to add student....Try again');
					}
					this.loading = false;
				},
				error => {
					this.alertService.error('Unable to save student...');
					this.loading = false;
				});
		}
	}

	deleteStudent(c: Student) {
		if (confirm('Are You sure To Delete Student ?')) {
			this.loading = true;
			this.studentService.delete(c.id).subscribe(
				data => {
					if (data && !isNullOrUndefined(data.data) && data.data) {
						this.refreshStudents();
						this.alertService.success('Student has been deleted...', false);
					}else {
						this.alertService.error('Sorry... Error occurred Unable to delete student');
					}
					this.loading = false;
				},
				error => {
					this.alertService.error('Sorry... Error occurred Unable to delete student');
					this.loading = false;
				}
			);
		}
	}

	refreshStudents() {
		this.studentService.getAll(this.user).subscribe(
			data => {
				if (data && !isNullOrUndefined(data.data) && data.data && !isBoolean(data.data)) {
					this.students = data.data;
					this.tempStudents = data.data;
				}
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
