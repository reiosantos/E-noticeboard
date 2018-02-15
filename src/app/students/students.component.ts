import { Component, OnInit } from '@angular/core';
import {User} from '../_models/user';
import {Student} from '../_models/student';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertService} from '../_services/alert.service';
import {StudentService} from '../_services/student.service';
import {isBoolean, isNullOrUndefined} from 'util';

@Component({
	selector: 'app-students',
	templateUrl: './students.component.html',
	styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {

	user: User;
	modalStudent: Student;
	addStudentForm: FormGroup;

	loading = false;
	studentSubmitted = false;
	students: any = [];

	tempStudents: Student[] = [];
	searchTerm: string;
	searchForm: FormGroup;
	constructor(
		private alertService: AlertService,
		private studentService: StudentService,
		private fb: FormBuilder
	) {
		this.user = JSON.parse(localStorage.getItem('currentUser'));
		this.addStudentForm = fb.group({
			first_name: ['', Validators.compose([Validators.required])],
			last_name: ['', Validators.compose([Validators.required])],
			student_no: ['', Validators.compose([Validators.required])],
			registration_no: ['', Validators.compose([Validators.required])],
		});
		this.searchForm = fb.group({ search: [''] });
		this.modalStudent = new Student();
	}

	ngOnInit() {
		this.refreshStudents();
	}

	editStudent(c: Student) {
		this.modalStudent = c;
	}

	searchItems() {
		this.searchTerm = this.searchForm.controls.search.value;
		const temp: Student[] = [];
		for (let i = 0; i < this.tempStudents.length; i++) {
			const note = this.tempStudents[i];
			if ((note.first_name.toLowerCase()).search(this.searchTerm.toLowerCase()) >= 0 ||
				(note.last_name.toLowerCase()).search(this.searchTerm.toLowerCase()) >= 0
			) {
				temp.push(note);
			}
		}
		this.students = temp;
	}

	studentSubmit() {
		this.studentSubmitted = true;
		if (this.addStudentForm.valid) {
			this.loading = true;
			const us = new Student();
			us.first_name = this.addStudentForm.controls.first_name.value;
			us.last_name = this.addStudentForm.controls.last_name.value;
			us.student_no = this.addStudentForm.controls.student_no.value;
			us.registration_no = this.addStudentForm.controls.registration_no.value;
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
		this.studentService.getAll().subscribe(
			data => {
				if (data && !isNullOrUndefined(data.data) && data.data && !isBoolean(data.data)) {
					this.students = data.data;
					this.tempStudents = data.data;
				}
			},
		);
	}

}
