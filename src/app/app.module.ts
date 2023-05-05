import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PushModule } from '@ngrx/component';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { GlobalStore } from './store/global.store';

@NgModule({
  declarations: [
    AppComponent,
    SafeHtmlPipe,

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
