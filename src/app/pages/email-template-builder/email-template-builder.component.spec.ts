import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailTemplateBuilderComponent } from './email-template-builder.component';

describe('EmailTemplateBuilderComponent', () => {
  let component: EmailTemplateBuilderComponent;
  let fixture: ComponentFixture<EmailTemplateBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailTemplateBuilderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailTemplateBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
