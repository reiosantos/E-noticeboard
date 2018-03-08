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
import {Programme} from '../_models/programme';
import {ProgrammeService} from '../_services/programme.service';

@Component({
	selector: 'app-timetables',
	templateUrl: './timetables.component.html',
	styleUrls: ['./timetables.component.css']
})
export class TimetablesComponent implements OnInit, OnDestroy {

	user: User = null;
	addTable = true;
	loading = false;
	addTableForm: FormGroup;
	modalTimetable: Timetable;
	tableSubmitted = false;
	tables: Timetable[] = [];
	programmes: Programme[] = [];
	downloading = false;

	tableSubscription: any;
	timerSubscription: any;

	tempTables: Timetable[] = [];
	searchTerm: string;
	searchForm: FormGroup;
	constructor(
		private alertService: AlertService,
		private tableService: TimetableService,
		private programmeService: ProgrammeService,
		private fb: FormBuilder
	) {
		if (localStorage.getItem(environment.userStorageKey) !== null) {
			this.user = JSON.parse(localStorage.getItem(environment.userStorageKey));
		}
		this.addTableForm = fb.group({
			programme_id: ['', Validators.compose([Validators.required])],
			pdf_file: ['', Validators.compose([Validators.required])],
			year: ['', Validators.compose([Validators.required, Validators.maxLength(4), Validators.minLength(4)])],
			semester: ['', Validators.compose([Validators.required, Validators.min(1), Validators.max(2), Validators.maxLength(1)])],
		});
		this.searchForm = fb.group({ search: [''] });
		this.modalTimetable = new Timetable();
	}

	ngOnInit() {
		this.refreshProgrammes();
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
			if ((note.year.toLowerCase()).search(this.searchTerm.trim().toLowerCase()) >= 0 ||
				(note.programme_code.toLowerCase()).search(this.searchTerm.trim().toLowerCase()) >= 0 ||
				(note.programme_name.toLowerCase()).search(this.searchTerm.trim().toLowerCase()) >= 0
			) {
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
			const files = event.target.files;
			const file = files[0];

			if (files && file) {
				if (!file.type.match('application.pdf')) {
					alert('Not a pdf file');
					return false;
				}
				if (file.size > ( 1024 * 1024 * 2)) { // checking for 2MB maximum
					alert('File is too large... 2MB maximum');
					return false;
				}
				const reader = new FileReader();
				reader.onload = () => {
					const binaryString = reader.result;

					this.addTableForm.controls['pdf_file'].setValue(binaryString);
				};
				reader.onerror = () => {
					console.log('there are some problems');

				};
				reader.readAsDataURL(file);
			}
		}
	}

	generateFileName(us: Timetable): string {
		return (us.year + '_' + us.semester + '_' +
			((us.post_date.replace(' ', '_')).replace('-', '_'))
				.replace(':', '_')) + '.pdf';
	}

	tableSubmit() {
		this.tableSubmitted = true;
		if (this.addTableForm.controls.pdf_file.value.trim() === '') {
			alert('please choose a pdf file... and less than 2MB');
			return false;
		}
		if (this.addTableForm.valid) {
			this.loading = true;
			const us = new Timetable();
			us.programme_id = this.addTableForm.controls.programme_id.value;
			us.year = this.addTableForm.controls.year.value;
			us.semester = this.addTableForm.controls.semester.value;
			us.file = this.addTableForm.controls.pdf_file.value;
			if (this.modalTimetable) {
				us.id = this.modalTimetable.id;
			}
			us.post_date = environment.generateDate();
			us.file_name = this.generateFileName(us);

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
		this.tableService.getAll(this.user).subscribe(
			data => {
				if (data && !isNullOrUndefined(data.data) && data.data && !isBoolean(data.data)) {
					/*let temp: Timetable[] = data.data;
					for(let i=0;i<temp.length;i++){
					  let obj: Timetable = temp[i];
					  this.tables.push(obj);
					  this.tempTables.push(obj);
					}*/
					this.tables = data.data;
					this.tempTables = data.data;
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

	download(table: Timetable) {
		this.downloading = true;
		table.file = 'timetable';

		this.tableService.download(table).subscribe(
			data => {
				this.downloading = false;
			}, error => {
				this.downloading = false;

			}
		);
	}
}
