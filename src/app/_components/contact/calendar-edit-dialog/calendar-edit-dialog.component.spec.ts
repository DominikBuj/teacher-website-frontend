import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CalendarEditDialogComponent} from './calendar-edit-dialog.component';

describe('CalendarEditDialogComponent', () => {
  let component: CalendarEditDialogComponent;
  let fixture: ComponentFixture<CalendarEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalendarEditDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
