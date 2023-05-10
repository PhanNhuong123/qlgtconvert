import { Component } from '@angular/core';
import { EmailContentStore } from './email-content.store';

@Component({
  selector: 'app-email-content',
  templateUrl: './email-content.component.html',
  styleUrls: ['./email-content.component.scss'],
  providers: [EmailContentStore]
})
export class EmailContentComponent {

}
