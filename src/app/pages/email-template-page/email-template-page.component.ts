import { EmailContentStore } from './../email-content.store';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EProperty } from 'src/app/app.constant';

@Component({
  selector: 'app-email-template-page',
  templateUrl: './email-template-page.component.html',
  styleUrls: ['./email-template-page.component.scss']
})
export class EmailTemplatePageComponent {
  constructor(private emailContentStore: EmailContentStore, private router: Router) { }

  EProperty = EProperty;

  vm$ = this.emailContentStore.select(state => {
    return {
      isShowTemplate: state.isShowTemplate,
      emailTemplates: state.emailTemplates,
      emailTemplateIndex: state.emailTemplateIndex,
    }
  });

  public chooseEmailTemplate(index: number): void {
    this.emailContentStore.updateEmailTemplateIndex(index ?? 0);
  }

  public backToQueryPanel(): void {
    this.emailContentStore.updateShowTemplate(false);
    this.router.navigateByUrl("/query");
  }

  public openEdit(htmlContent: string) {
    this.emailContentStore.updateHTMLContent(htmlContent);
    this.router.navigateByUrl('/edit')
  }
}
