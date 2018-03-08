import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from '../_models/user';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertService} from '../_services/alert.service';
import {Course} from '../_models/course';
import {CourseService} from '../_services/course.service';
import {isBoolean, isNullOrUndefined} from 'util';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/first';
import {environment} from '../../environments/environment.prod';
import {Programme} from '../_models/programme';
import {ProgrammeService} from '../_services/programme.service';

@Component({
	selector: 'app-courses',
	templateUrl: './courses.component.html',
	styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit, OnDestroy {

	user: User = null;
	modalCourse: Course;
	addCourseForm: FormGroup;

	loading = false;
	courseSubmitted = false;
	programmes: Programme[] = [];
	courses: any = [];

	courseSubscription: any;
	timerSubscription: any;

	tempCourses: Course[] = [];
	searchTerm: string;
	searchForm: FormGroup;
	constructor(
		private alertService: AlertService,
		private courseService: CourseService,
		private programmeService: ProgrammeService,
		private fb: FormBuilder
	) {
		if (localStorage.getItem(environment.userStorageKey) !== null) {
			this.user = JSON.parse(localStorage.getItem(environment.userStorageKey));
		}
		this.addCourseForm = fb.group({
			name: ['', Validators.compose([Validators.required])],
			code: ['', Validators.compose([Validators.required])],
			programme_id: ['', Validators.compose([Validators.required])],
		});
		this.searchForm = fb.group({ search: [''] });
		this.modalCourse = new Course();
	}

	ngOnInit() {
		this.refreshProgrammes();
		this.refreshCourses();
	}

	ngOnDestroy(): void {
		if (this.courseSubscription) {
			this.courseSubscription.unsubscribe();
		}
		if (this.timerSubscription) {
			this.timerSubscription.unsubscribe();
		}
	}

	courseSubmit() {
		this.courseSubmitted = true;
		if (this.addCourseForm.valid) {
			this.loading = true;
			const us = new Course();
			us.code = this.addCourseForm.controls.code.value;
			us.name = this.addCourseForm.controls.name.value;
			us.programme_id = this.addCourseForm.controls.programme_id.value;
			if (this.modalCourse) {
				us.id = this.modalCourse.id;
			}
			this.courseService.createOrUpdate(us).subscribe(
				data => {
					if (!data) {
						this.alertService.error('Internal Server Error. Consult the administrator.');
					}else if (!isNullOrUndefined(data.data) && data.data) {
						if (this.modalCourse) {
							this.alertService.success('Course has been modified...', false);
						}else {
							this.alertService.success('new course has been added...', false);
						}
						this.addCourseForm.reset('');
						this.courseSubmitted = false;
						this.modalCourse = new Course();
						this.refreshCourses();
					}else {
						this.alertService.error('Unable to add course....Try again');
					}
					this.loading = false;
				},
				error => {
					this.alertService.error('Unable to save course...');
					this.loading = false;
				});
		}
	}

	editCourse(c: Course) {
		this.modalCourse = c;
	}

	searchItems() {
		this.searchTerm = this.searchForm.controls.search.value;
		const temp: Course[] = [];
		for (let i = 0; i < this.tempCourses.length; i++) {
			const note = this.tempCourses[i];
			if ((note.name.toLowerCase()).search(this.searchTerm.trim().toLowerCase()) >= 0 ||
				(note.programme_code.toLowerCase()).search(this.searchTerm.trim().toLowerCase()) >= 0 ||
				(note.code.toLowerCase()).search(this.searchTerm.trim().toLowerCase()) >= 0 ||
				(note.programme_name.toLowerCase()).search(this.searchTerm.trim().toLowerCase()) >= 0
			) {
				temp.push(note);
			}
		}
		this.courses = temp;
	}

	deleteCourse(c: Course) {
		if (confirm('Are You sure To Delete This Course ?')) {
			this.loading = true;
			this.courseService.delete(c.id).subscribe(
				data => {
					if (data && !isNullOrUndefined(data.data) && data.data) {
						this.refreshCourses();
						this.alertService.success('Course has been deleted...', false);
					}else {
						this.alertService.error('Sorry... Error occurred Unable to delete Course');
					}
					this.loading = false;
				},
				error => {
					this.alertService.error('Sorry... Error occurred Unable to delete Course');
					this.loading = false;
				}
			);
		}
	}

	private subscribeToData(): void {
		this.timerSubscription = Observable.timer(300000).first().subscribe(() => this.refreshCourses());
	}

	refreshCourses() {
		this.courseService.getAll(this.user).subscribe(
			data => {
				if (data && !isNullOrUndefined(data.data) && data.data && !isBoolean(data.data)) {
					this.courses = data.data;
					this.tempCourses = data.data;
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
