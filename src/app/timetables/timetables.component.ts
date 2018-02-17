import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {User} from '../_models/user';
import {Timetable} from '../_models/timetable';
import {AlertService} from '../_services/alert.service';
import {TimetableService} from '../_services/timetable.service';
import {isBoolean, isNullOrUndefined} from 'util';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/first';
import {environment} from '../../environments/environment.prod';

@Component({
	selector: 'app-timetables',
	templateUrl: './timetables.component.html',
	styleUrls: ['./timetables.component.css']
})
export class TimetablesComponent implements OnInit, OnDestroy {

	user: User;
	addTable = true;
	loading = false;
	addTableForm: FormGroup;
	modalTimetable: Timetable;
	tableSubmitted = false;
	tables: any = [];

	tableSubscription: any;
	timerSubscription: any;

	tempTables: Timetable[] = [];
	searchTerm: string;
	searchForm: FormGroup;
	constructor(
		private alertService: AlertService,
		private tableService: TimetableService,
		private fb: FormBuilder
	) {
		this.user = JSON.parse(localStorage.getItem(environment.userStorageKey));
		this.addTableForm = fb.group({
			title: ['', Validators.compose([Validators.required])],
			pdf_file: null,
			year: ['', Validators.compose([Validators.required])],
			semester: ['', Validators.compose([Validators.required])],
		});
		this.searchForm = fb.group({ search: [''] });
		this.modalTimetable = new Timetable();
	}

	ngOnInit() {
		this.refreshTables();
	}

	ngOnDestroy(): void {
		if (this.tableSubscription) {
			this.tableSubscription.unsubscribe();
		}
		if (this.timerSubscription) {
			this.timerSubscription.unsubscribe();
		}
	}

	searchItems() {
		this.searchTerm = this.searchForm.controls.search.value;
		const temp: Timetable[] = [];
		for (let i = 0; i < this.tempTables.length; i++) {
			const note = this.tempTables[i];
			if ((note.year.toLowerCase()).search(this.searchTerm.toLowerCase()) >= 0) {
				temp.push(note);
			}
		}
		this.tables = temp;
	}

	private subscribeToData(): void {
		this.timerSubscription = Observable.timer(300000).first().subscribe(() => this.refreshTables());
	}

	onFileChange(event) {
		if (event.target.files.length > 0) {
			const file = event.target.files[0];
			this.addTableForm.get('pdf_file').setValue(file);
		}
	}

	tableSubmit() {
		this.tableSubmitted = true;
		if (this.addTableForm.valid) {
			this.loading = true;
			const us = new Timetable();
			us.title = this.addTableForm.controls.title.value;
			us.year = this.addTableForm.controls.year.value;
			us.semester = this.addTableForm.controls.semester.value;
			us.file = this.addTableForm.controls.pdf_file.value;
			if (this.modalTimetable) {
				us.id = this.modalTimetable.id;
			}
			this.tableService.createOrUpdate(us).subscribe(
				data => {
					if (!data) {
						this.alertService.error('Internal Server Error. Consult the administrator.');
					}else if (!isNullOrUndefined(data.data) && data.data) {
						if (this.modalTimetable) {
							this.alertService.success('Table has been modified...', false);
						}else {
							this.alertService.success('new time table has been posted...', false);
						}
						this.addTableForm.reset('');
						this.tableSubmitted = false;
						this.modalTimetable = new Timetable();
						this.refreshTables();
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

	editTable(e: Timetable) {
		this.modalTimetable = e;
	}

	deleteTable(e: Timetable) {
		if (confirm('Are You sure To Delete This Event ?')) {
			this.loading = true;
			this.tableService.delete(e.id).subscribe(
				data => {
					if (data && !isNullOrUndefined(data.data) && data.data) {
						this.refreshTables();
						this.alertService.success('Time table has been deleted...', false);
					}else {
						this.alertService.error('Sorry... Error occurred Unable to delete Time table');
					}
					this.loading = false;
				},
				error => {
					this.alertService.error('Sorry... Error occurred Unable to delete Time table');
					this.loading = false;
				}
			);
		}
	}

	refreshTables() {
		this.tableService.getAll().subscribe(
			data => {
				if (data && !isNullOrUndefined(data.data) && data.data && !isBoolean(data.data)) {
					this.tables = data.data;
					this.tempTables = data.data;
				}
				this.subscribeToData();
			},
		);
	}
}
