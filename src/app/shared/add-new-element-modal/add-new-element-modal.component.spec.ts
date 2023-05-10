import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewElementModalComponent } from './add-new-element-modal.component';

describe('AddNewElementModalComponent', () => {
  let component: AddNewElementModalComponent;
  let fixture: ComponentFixture<AddNewElementModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewElementModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNewElementModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
