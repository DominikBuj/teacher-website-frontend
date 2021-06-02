import {ComponentFixture, TestBed} from '@angular/core/testing';

import {OrcidImportDialogComponent} from './orcid-import-dialog.component';

describe('OrcidImportDialogComponent', () => {
  let component: OrcidImportDialogComponent;
  let fixture: ComponentFixture<OrcidImportDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrcidImportDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrcidImportDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
