import { ContentComponent } from './pages/email-template-builder/content/content.component';
import { EmailTemplateBuilderComponent } from './pages/email-template-builder/email-template-builder.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './pages/email-content/home-page/home-page.component';
import { QueryPageComponent } from './pages/email-content/query-page/query-page.component';
import { EmailTemplatePageComponent } from './pages/email-content/email-template-page/email-template-page.component';
import { EmailContentComponent } from './pages/email-content/email-content.component';


const routes: Routes = [
  {
    path: "",
    component: EmailContentComponent,
    children: [
      {
        path: "",
        component: HomePageComponent
      },
      {
        path: "query",
        component: QueryPageComponent
      },
      {
        path: "email-template-page",
        component: EmailTemplatePageComponent
      }
    ]
  },
  {
    path: 'edit',
    component: EmailTemplateBuilderComponent,
    children: [
      {
        path: '',
        component: ContentComponent
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
