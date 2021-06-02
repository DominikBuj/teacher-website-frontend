import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PublicationEditDialogComponent} from './publication-edit-dialog.component';

describe('PublicationEditDialogComponent', () => {
  let component: PublicationEditDialogComponent;
  let fixture: ComponentFixture<PublicationEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicationEditDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicationEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
