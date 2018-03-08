import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../environments/environment.prod';
import {Room} from '../_models/room';

@Injectable()
export class RoomService {
	constructor(private http: HttpClient) { }

	getAll() {
		return this.http.get<any>(environment.api + '?action=load&table=rooms');
	}

	createOrUpdate(c: Room) {
		return this.http.post<any>(environment.api, { action: 'insertOrUpdate', table: 'rooms', room: JSON.stringify(c)});
	}

	delete(id: number) {
		return this.http.get<any>(environment.api + '?action=delete&table=rooms&id=' + id);
	}
}
