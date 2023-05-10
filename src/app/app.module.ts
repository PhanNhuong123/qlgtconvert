import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PushModule } from '@ngrx/component';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { GlobalStore } from './store/global.store';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { QueryPageComponent } from './pages/query-page/query-page.component';
import { EmailTemplatePageComponent } from './pages/email-template-page/email-template-page.component';

@NgModule({
  declarations: [
    AppComponent,
    SafeHtmlPipe,
    HomePageComponent,
    QueryPageComponent,
    EmailTemplatePageComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    PushModule
  ],
  providers: [GlobalStore],
  bootstrap: [AppComponent]
})
export class AppModule { }
