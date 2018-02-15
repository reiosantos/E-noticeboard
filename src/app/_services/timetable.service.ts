import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../environments/environment.prod';
import {Timetable} from '../_models/timetable';

@Injectable()
export class TimetableService {
	constructor(private http: HttpClient) { }

	getAll() {
		return this.http.get<any>(environment.api + '?action=load&table=timetables');
	}

	createOrUpdate(c: Timetable) {
		return this.http.post<any>(environment.api, { action: 'insertOrUpdate', table: 'timetables', timetable: JSON.stringify(c)});
	}

	delete(id: number) {
		return this.http.get<any>(environment.api + '?action=delete&table=timetables&id=' + id);
	}
}
