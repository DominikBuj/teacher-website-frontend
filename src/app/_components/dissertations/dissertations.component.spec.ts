import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DissertationsComponent} from './dissertations.component';

describe('DissertationsComponent', () => {
  let component: DissertationsComponent;
  let fixture: ComponentFixture<DissertationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DissertationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DissertationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
