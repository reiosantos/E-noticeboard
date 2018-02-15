import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpshotsComponent } from './upshots.component';

describe('UpshotsComponent', () => {
	let component: UpshotsComponent;
	let fixture: ComponentFixture<UpshotsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ UpshotsComponent ]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UpshotsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
