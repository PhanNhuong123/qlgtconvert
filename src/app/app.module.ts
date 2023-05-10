import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PushModule } from '@ngrx/component';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { ContentComponent, EmailContentComponent, EmailTemplateBuilderComponent, EmailTemplatePageComponent, HomePageComponent, PropertiesSidebarComponent, QueryPageComponent } from './pages/index';

import { AddNewElementModalComponent, LoadingComponent } from './shared/index';

@NgModule({
  declarations: [
    AppComponent,
    SafeHtmlPipe,
    HomePageComponent,
    QueryPageComponent,
    EmailTemplatePageComponent,
    EmailContentComponent,
    EmailTemplateBuilderComponent,
    ContentComponent,
    PropertiesSidebarComponent,
    AddNewElementModalComponent,
    LoadingComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    PushModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
