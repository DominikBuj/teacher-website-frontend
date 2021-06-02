import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DissertationEditDialogComponent} from './dissertation-edit-dialog.component';

describe('DissertationEditDialogComponent', () => {
  let component: DissertationEditDialogComponent;
  let fixture: ComponentFixture<DissertationEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DissertationEditDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DissertationEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
