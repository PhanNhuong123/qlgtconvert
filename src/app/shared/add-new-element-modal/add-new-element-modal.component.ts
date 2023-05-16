import { Component } from '@angular/core';
import { buttons } from 'src/app/constants/buttons';
import { BodyItem } from 'src/app/model/body-item';
import { EmailTemplateBuilderStore } from 'src/app/pages/email-template-builder/email-template.store';

@Component({
  selector: 'app-add-new-element-modal',
  templateUrl: './add-new-element-modal.component.html',
  styleUrls: ['./add-new-element-modal.component.scss']
})
export class AddNewElementModalComponent {
  buttons = buttons;
  constructor(private emailTemplateBuilderStore: EmailTemplateBuilderStore) { }

  ngOnInit(): void { }

  getCssStyle(item: BodyItem) {
    return this.emailTemplateBuilderStore.getCssStyle(item);
  }
}
