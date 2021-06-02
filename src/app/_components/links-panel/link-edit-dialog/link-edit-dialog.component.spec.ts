import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LinkEditDialogComponent} from './link-edit-dialog.component';

describe('LinkEditDialogComponent', () => {
  let component: LinkEditDialogComponent;
  let fixture: ComponentFixture<LinkEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinkEditDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
