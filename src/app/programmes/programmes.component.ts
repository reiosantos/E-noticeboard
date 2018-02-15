import { Component, OnInit } from '@angular/core';
import {User} from '../_models/user';
import {Programme} from '../_models/programme';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertService} from '../_services/alert.service';
import {isBoolean, isNullOrUndefined} from 'util';
import {ProgrammeService} from '../_services/programme.service';

@Component({
	selector: 'app-programmes',
	templateUrl: './programmes.component.html',
	styleUrls: ['./programmes.component.css']
})
export class ProgrammesComponent implements OnInit {

	user: User;
	modalProgamme: Programme;
	addProgrammeForm: FormGroup;

	loading = false;
	programmeSubmitted = false;
	programmes: any = [];

	tempProgramme: Programme[] = [];
	searchTerm: string;
	searchForm: FormGroup;
	constructor(
		private alertService: AlertService,
		private programmeService: ProgrammeService,
		private fb: FormBuilder
	) {
		this.user = JSON.parse(localStorage.getItem('currentUser'));
		this.addProgrammeForm = fb.group({
			name: ['', Validators.compose([Validators.required])],
			code: ['', Validators.compose([Validators.required])],
		});
		this.searchForm = fb.group({ search: [''] });
		this.modalProgamme = new Programme();
	}

	ngOnInit() {
		this.refreshProgrammes();
	}

	programmeSubmit() {
		this.programmeSubmitted = true;
		if (this.addProgrammeForm.valid) {
			this.loading = true;
			const us = new Programme();
			us.code = this.addProgrammeForm.controls.code.value;
			us.name = this.addProgrammeForm.controls.name.value;
			if (this.modalProgamme) {
				us.id = this.modalProgamme.id;
			}
			this.programmeService.createOrUpdate(us).subscribe(
				data => {
					if (!data) {
						this.alertService.error('Internal Server Error. Consult the administrator.');
					}else if (!isNullOrUndefined(data.data) && data.data) {
						if (this.modalProgamme) {
							this.alertService.success('Programme has been modified...', false);
						}else {
							this.alertService.success('new programme has been added...', false);
						}
						this.addProgrammeForm.reset('');
						this.programmeSubmitted = false;
						this.modalProgamme = new Programme();
						this.refreshProgrammes();
					}else {
						this.alertService.error('Unable to add programme...Try again');
					}
					this.loading = false;
				},
				error => {
					this.alertService.error('Unable to save programme...');
					this.loading = false;
				});
		}
	}

	editProgramme(c: Programme) {
		this.modalProgamme = c;
	}

	searchItems() {
		this.searchTerm = this.searchForm.controls.search.value;
		const temp: Programme[] = [];
		for (let i = 0; i < this.tempProgramme.length; i++) {
			const note = this.tempProgramme[i];
			if ((note.name.toLowerCase()).search(this.searchTerm.toLowerCase()) >= 0) {
				temp.push(note);
			}
		}
		this.programmes = temp;
	}

	deleteProgramme(c: Programme) {
		if (confirm('Are You sure To Delete This Programme ?')) {
			this.loading = true;
			this.programmeService.delete(c.id).subscribe(
				data => {
					if (data && !isNullOrUndefined(data.data) && data.data) {
						this.refreshProgrammes();
						this.alertService.success('Programme has been deleted...', false);
					}else {
						this.alertService.error('Sorry... Error occurred Unable to delete Programme');
					}
					this.loading = false;
				},
				error => {
					this.alertService.error('Sorry... Error occurred Unable to delete Programme');
					this.loading = false;
				}
			);
		}
	}

	refreshProgrammes() {
		this.programmeService.getAll().subscribe(
			data => {
				if (data && !isNullOrUndefined(data.data) && data.data && !isBoolean(data.data)) {
					this.programmes = data.data;
					this.tempProgramme = data.data;
				}
			},
		);
	}

}
