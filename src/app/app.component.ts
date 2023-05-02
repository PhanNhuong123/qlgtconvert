import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IProperties, properties } from './app.constant';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'email-content-tool';
  public queryText: string = '';
  public queryShow: string = '';
  public properties: IProperties[] = properties;
  public isProcess: boolean = false;
  public editQuery: boolean = false;
  public isQueryInset: boolean = true;

  constructor(private httpClient: HttpClient, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.httpClient.get('assets/emails_emailscontent.sql', { responseType: 'text' }).subscribe(res => {
      if (res) {
        this.queryText = res;
      }
    }
    )
  }

  public rePlaceKeyCode(): void {
    let result = this.queryText
    this.properties.forEach(property => {
      const keys = Object.keys(property).filter(key => key !== 'propertyName');
      keys.forEach(key => {
        if (key.trim().length >= 0) {
          result = result.replaceAll(`##${property.propertyName + key}##`, property[key] ?? '');
        }
      })
    })
    this.queryShow = result;
  }

  public processing(): void {
    this.rePlaceKeyCode();
    if (!this.isQueryInset) {
      this.convertAllInsertToUpdate();
    }
    this.isProcess = true;

  }

  public onInputChange(event: Event, property: IProperties, tap: string): void {
    event.preventDefault();
    if (property[tap] !== undefined) {
      property[tap] = (event.target as HTMLInputElement)?.value ?? '';
    }
  }

  public copyQuery(): void {
    navigator.clipboard.writeText(this.queryShow);
    alert('copied !!')
  }

  public back() {
    this.isProcess = false;
    this.editQuery = false;
  }

  public handleQueyChange(event: Event): void {
    if (event.target) {
      this.queryText = (event.target as HTMLInputElement).value ?? '';
    }
  }

  public closeEditQuery(): void {
    this.editQuery = false;
  }

  public openEditQuery(): void {
    this.editQuery = true;
  }

  public convertAllInsertToUpdate(): void {
    const tables: string[] = this.queryShow.split('INSERT INTO').map(value => 'INSERT INTO' + value);
    tables.shift();
    this.queryShow = '';
    tables.forEach(value => {
      this.queryShow += this.convertInsertToUpdate(value)
    })
  }

  public convertInsertToUpdate(insertQuery: string): string {
    const tableName = '`' + insertQuery.match(/(?<=(insert\sinto\s[`'"]))\w+(?=['"`])/gi)?.[0] + '`';

    const columnsStartIndex = insertQuery.indexOf('(') + 1;
    const columns = insertQuery.slice(columnsStartIndex, insertQuery.indexOf(')')).split(',');
    const trimmedColumns = columns.map((col) => col.trim());
    trimmedColumns.shift();

    const valuesStartIndex = insertQuery.indexOf('VALUES') + 7;
    const valuesEndIndex = insertQuery.lastIndexOf(';');
    const valuesStr = insertQuery.slice(valuesStartIndex, valuesEndIndex).trim();
    const valuesList = valuesStr.slice(1, -1).split(/(?<=\d+\s*),(?=\s*\d+)|(?<=\w*\s*')\s*,\s*(?='\s*\w*)|(?<=\d+\s*),\s*(?='\s*\w*)|(?<=\w*\s*')\s*,(?=\s*\d+)/gi);
    valuesList.shift();

    const trimmedValues = valuesList.map((val) => val.trim());
    const setClauses = trimmedColumns.map((col, i) => `${col} = ${trimmedValues[i]}`).join(', ');
    let updateQuery = `UPDATE ${tableName} SET ${setClauses}`;

    const indexTrigger = trimmedColumns.findIndex(value => value === '`trigger`');
    const whereClauses = '`trigger`' + ' = ' + trimmedValues[indexTrigger];
    updateQuery += ` WHERE ${whereClauses};`;

    return updateQuery;
  }

  public changeQueryShow(type: 'inset' | 'update'): void {
    if (type === 'inset' && !this.isQueryInset) {
      this.isQueryInset = true;
      this.rePlaceKeyCode();
    } else if (this.isQueryInset) {
      this.isQueryInset = false;
      this.convertAllInsertToUpdate();
    }
  }

  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
}
