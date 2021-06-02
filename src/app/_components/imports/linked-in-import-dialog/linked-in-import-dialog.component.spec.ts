import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LinkedInImportDialogComponent} from './linked-in-import-dialog.component';

describe('LinkedInImportDialogComponent', () => {
  let component: LinkedInImportDialogComponent;
  let fixture: ComponentFixture<LinkedInImportDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinkedInImportDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkedInImportDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
