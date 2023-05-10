import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { EProperty, IProperty, ITemplate } from './app.constant';
import { GlobalStore } from './store/global.store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'email-content-tool';
}
