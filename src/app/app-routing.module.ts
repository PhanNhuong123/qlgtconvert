import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { QueryPageComponent } from './pages/query-page/query-page.component';
import { EmailTemplatePageComponent } from './pages/email-template-page/email-template-page.component';

const routes: Routes = [
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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
