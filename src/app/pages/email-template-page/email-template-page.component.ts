import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EProperty } from 'src/app/app.constant';
import { GlobalStore } from 'src/app/store/global.store';

@Component({
  selector: 'app-email-template-page',
  templateUrl: './email-template-page.component.html',
  styleUrls: ['./email-template-page.component.scss']
})
export class EmailTemplatePageComponent {
  constructor(private store: GlobalStore, private router: Router) { }

  EProperty = EProperty;

  vm$ = this.store.select(state => {
    return {
      isShowTemplate: state.isShowTemplate,
      emailTemplates: state.emailTemplates,
      emailTemplateIndex: state.emailTemplateIndex,
    }
  });

  public chooseEmailTemplate(index: number): void {
    this.store.updateEmailTemplateIndex(index ?? 0);
  }

  public backToQueryPanel(): void {
    this.store.updateShowTemplate(false);
    this.router.navigateByUrl("/query");
  }
}
