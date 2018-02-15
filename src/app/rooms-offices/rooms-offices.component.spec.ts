import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomsOfficesComponent } from './rooms-offices.component';

describe('RoomsOfficesComponent', () => {
	let component: RoomsOfficesComponent;
	let fixture: ComponentFixture<RoomsOfficesComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ RoomsOfficesComponent ]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(RoomsOfficesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
