import { Component, OnInit } from '@angular/core';
import {isBoolean, isNullOrUndefined} from 'util';
import {User} from '../_models/user';
import {Room} from '../_models/room';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertService} from '../_services/alert.service';
import {RoomService} from '../_services/room.service';
import {environment} from '../../environments/environment.prod';

@Component({
	selector: 'app-rooms-offices',
	templateUrl: './rooms-offices.component.html',
	styleUrls: ['./rooms-offices.component.css']
})
export class RoomsOfficesComponent implements OnInit {

	user: User = null;
	modalRoom: Room;
	addRoomForm: FormGroup;

	loading = false;
	roomSubmitted = false;
	rooms: any = [];

	tempRooms: Room[] = [];
	searchTerm: string;
	searchForm: FormGroup;
	constructor(
		private alertService: AlertService,
		private roomService: RoomService,
		private fb: FormBuilder
	) {
		if (localStorage.getItem(environment.userStorageKey) !== null) {
			this.user = JSON.parse(localStorage.getItem(environment.userStorageKey));
		}
		this.addRoomForm = fb.group({
			block: ['', Validators.compose([Validators.required])],
			level: ['', Validators.compose([Validators.required])],
			number: ['', Validators.compose([Validators.required])],
		});
		this.searchForm = fb.group({ search: [''] });
		this.modalRoom = new Room();
	}

	ngOnInit() {
		this.refreshRooms();
	}

	editRoom(c: Room) {
		this.modalRoom = c;
	}

	searchItems() {
		this.searchTerm = this.searchForm.controls.search.value;
		const temp: Room[] = [];
		for (let i = 0; i < this.tempRooms.length; i++) {
			const note = this.tempRooms[i];
			if ((note.number.toLowerCase()).search(this.searchTerm.trim().toLowerCase()) >= 0 ||
				(note.level.toLowerCase()).search(this.searchTerm.trim().toLowerCase()) >= 0 ||
				(note.block.toLowerCase()).search(this.searchTerm.trim().toLowerCase()) >= 0
			) {
				temp.push(note);
			}
		}
		this.rooms = temp;
	}

	roomSubmit() {
		this.roomSubmitted = true;
		if (this.addRoomForm.valid) {
			this.loading = true;
			const us = new Room();
			us.block = this.addRoomForm.controls.block.value;
			us.level = this.addRoomForm.controls.level.value;
			us.number = this.addRoomForm.controls.number.value;
			if (this.modalRoom) {
				us.id = this.modalRoom.id;
			}
			this.roomService.createOrUpdate(us).subscribe(
				data => {
					if (!data) {
						this.alertService.error('Internal Server Error. Consult the administrator.');
					}else if (!isNullOrUndefined(data.data) && data.data) {
						if (this.modalRoom) {
							this.alertService.success('Room info has been modified...', false);
						}else {
							this.alertService.success('Room has been added...', false);
						}
						this.addRoomForm.reset('');
						this.roomSubmitted = false;
						this.modalRoom = new Room();
						this.refreshRooms();
					}else {
						this.alertService.error('Unable to add room....Try again');
					}
					this.loading = false;
				},
				error => {
					this.alertService.error('Unable to save room...');
					this.loading = false;
				});
		}
	}

	deleteRoom(c: Room) {
		if (confirm('Are You sure To Delete Room ?')) {
			this.loading = true;
			this.roomService.delete(c.id).subscribe(
				data => {
					if (data && !isNullOrUndefined(data.data) && data.data) {
						this.refreshRooms();
						this.alertService.success('Room/office has been deleted...', false);
					}else {
						this.alertService.error('Sorry... Error occurred Unable to delete room');
					}
					this.loading = false;
				},
				error => {
					this.alertService.error('Sorry... Error occurred Unable to delete');
					this.loading = false;
				}
			);
		}
	}

	refreshRooms() {
		this.roomService.getAll().subscribe(
			data => {
				if (data && !isNullOrUndefined(data.data) && data.data && !isBoolean(data.data)) {
					this.rooms = data.data;
					this.tempRooms = data.data;
				}
			},
		);
	}

}
