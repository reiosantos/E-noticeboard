import {Subject} from 'rxjs/Subject';
import {Injectable} from '@angular/core';

@Injectable()
export class SharedService {
	private emitChangeSource = new Subject<any>();
	changeEmitted$ = this.emitChangeSource.asObservable();

	emitChange(change: any) {
		this.emitChangeSource.next(change);
	}
}
