import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { EProperty, IProperty, ITemplate } from './app.constant';
import { GlobalStore } from './store/global.store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [GlobalStore]
})
export class AppComponent implements OnInit {
  title = 'email-content-tool';
  // public queryText: string = '';
  // public queryShow: string = '';
  // public properties: IProperty[] = properties;
  // public isProcess: boolean = false;
  // public editQuery: boolean = false;
  // public isQueryInset: boolean = true;
  // public isEditingRawFile: boolean = false;
  // public errorText = 'Error to convert raw file !';
  // public emailTemplates: ITemplate[] = [];
  // public isShowTemplate: boolean = false;
  // public emailTemplateIndex: number = 0;

  constructor(
    private httpClient: HttpClient,
    private sanitizer: DomSanitizer,
    private store: GlobalStore
  ) { }

  EProperty = EProperty;

  vm$ = this.store.select(state => {
    return {
      queryText: state.queryText,
      queryShow: state.queryShow,
      properties: state.properties,
      isProcess: state.isProcess,
      editQuery: state.editQuery,
      isQueryInsert: state.isQueryInsert,
      isEditingRawFile: state.isEditingRawFile,
      errorText: state.errorText,
      isShowTemplate: state.isShowTemplate,
      emailTemplateIndex: state.emailTemplateIndex,
      emailTemplates: state.emailTemplates
    }
  })

  ngOnInit(): void {
    this.httpClient
      .get('assets/emails_emailscontent.sql', { responseType: 'text' })
      .subscribe((res) => {
        if (res) {
          this.store.updateQueryText(res);
        }
      });
  }

  public chooseEmailTemplate(index: number): void {
    this.store.updateEmailTemplateIndex(index ?? 0);
  }

  public getListTemplate() {
    this.store.emailTemplates.length = 0;
    this.rePlaceKeyCode();
    console.log(this.store.queryShow);

    const tables: string[] = this.store.queryShow
      .split('INSERT INTO')
      .map((value) => 'INSERT INTO' + value);
    tables.shift();
    tables.forEach((tableQuery, index) => {
      const updateQuery = this.convertInsertToUpdate(tableQuery);
      const htmlContent: string =
        /(?<=htmlcontent\s*[`']\s*=\s*[`']).*(?='\s*,\s*[`']userID[`'])/gi.exec(
          updateQuery
        )?.[0] ?? '';
      const email: string =
        /(?<=title\s*[`']\s*=\s*[`']).*(?='\s*,\s*[`']subject[`'])/gi.exec(
          updateQuery
        )?.[0] ?? '';
      const newTemplate: ITemplate = {
        id: index,
        email: email,
        htmlContent: htmlContent.replaceAll(/\\r\\n|\\/gi, ''),
      };
      this.store.updateEmailTemplates(newTemplate);
    });
  }

  public closeEmailTemplate() {
    this.store.updateShowTemplate(false);
  }

  public handleShowTemplate() {
    this.store.updateShowTemplate(true);
    this.getListTemplate();
  }

  public rePlaceKeyCode(): void {
    let result = this.store.queryText;
    this.store.properties.forEach((property) => {
      console.log(property.propertyName);

      const keys = Object.keys(property).filter(
        (key) => key !== 'propertyName'
      );
      keys.forEach((key) => {
        if (key.trim().length >= 0) {
          result = result.replaceAll(
            `##${property.propertyName + this.capitalizeFirstCharacter(key)}##`,
            property[key] ?? ''
          );
        }
      });
    });
    // this.queryShow = result;
    console.log(result);

    this.store.updateQueryShow(result);
  }

  public processing(): void {
    this.httpClient
      .get('assets/emails_emailscontent.sql', { responseType: 'text' })
      .subscribe((res) => {
        if (res) {
          this.store.updateQueryText(res);
          this.rePlaceKeyCode();
          if (!this.store.isQueryInsert) {
            this.convertAllInsertToUpdate();
          }
          this.getListTemplate();
          this.store.updateIsProcess(true);
        }
      });
  }

  public onInputChange(event: Event, property: IProperty, tap: string): void {
    event.preventDefault();
    if (property[tap] !== undefined) {
      property[tap] = (event.target as HTMLInputElement)?.value ?? '';
    }
  }

  public copyQuery(): void {
    navigator.clipboard.writeText(this.store.queryShow);
    alert('copied !!');
  }

  public back() {
    this.store.updateIsProcess(false);
    this.store.updateEditQuery(false);
  }

  public handleQueyChange(event: Event): void {
    if (event.target) {
      let value = (event.target as HTMLInputElement).value ?? '';
      this.store.updateQueryShow(value);
    }
  }

  public closeEditQuery(): void {
    this.store.updateEditQuery(false);
    if (this.store.isEditingRawFile) {
      this.store.updateEditingRawFile(false);
      this.store.updateQueryText(this.store.queryShow);
    }
  }

  public openEditQuery(): void {
    this.store.updateEditQuery(true);
  }

  public convertAllInsertToUpdate(): void {
    const tables: string[] = this.store.queryShow
      .split('INSERT INTO')
      .map((value) => 'INSERT INTO' + value);
    tables.shift();
    this.store.updateQueryShow('');
    tables.forEach((value) => {
      let newValue = this.store.queryShow;
      newValue += this.convertInsertToUpdate(value);
      this.store.updateQueryShow(newValue);
    });
  }

  public convertInsertToUpdate(insertQuery: string): string {
    const tableName =
      '`' +
      insertQuery.match(/(?<=(insert\s+into\s*[`'"]))\w+(?=['"`])/gi)?.[0] +
      '`';

    const columnsStartIndex = insertQuery.indexOf('(') + 1;
    const columns = insertQuery
      .slice(columnsStartIndex, insertQuery.indexOf(')'))
      .split(',');
    const trimmedColumns = columns.map((col) => col.trim());
    trimmedColumns.shift();

    const valuesStartIndex = insertQuery.indexOf('VALUES') + 7;
    const valuesEndIndex = insertQuery.lastIndexOf(';');
    const valuesStr = insertQuery
      .slice(valuesStartIndex, valuesEndIndex)
      .trim();
    const valuesList = valuesStr
      .slice(1, -1)
      .split(
        /(?<=\d+\s*),(?=\s*\d+)|(?<=\w*\s*')\s*,\s*(?='\s*\w*)|(?<=\d+\s*),\s*(?='\s*\w*)|(?<=\w*\s*')\s*,(?=\s*\d+)/gi
      );
    valuesList.shift();

    const trimmedValues = valuesList.map((val) => val.trim());
    const setClauses = trimmedColumns
      .map((col, i) => `${col} = ${trimmedValues[i]}`)
      .join(', ');
    let updateQuery = `UPDATE ${tableName} SET ${setClauses}`;

    const indexTrigger = trimmedColumns.findIndex(
      (value) => value === '`trigger`'
    );
    const whereClauses = '`trigger`' + ' = ' + trimmedValues[indexTrigger];
    updateQuery += ` WHERE ${whereClauses};`;

    return updateQuery;
  }

  public changeQueryShow(type: 'inset' | 'update'): void {
    if (this.store.isEditingRawFile) {
      this.store.updateEditingRawFile(false);
      this.store.updateQueryText(this.store.queryShow);
    }

    if (type === 'inset') {
      this.store.updateQueryInsert(true);
      this.rePlaceKeyCode();
    } else if (type === 'update') {
      this.store.updateQueryInsert(false);
      this.rePlaceKeyCode();
      this.convertAllInsertToUpdate();
    }
    if (this.store.queryShow.trim().length === 0) {
      this.store.updateQueryShow(this.store.errorText);
    }
  }

  public editRawFile() {
    this.store.updateEditingRawFile(true);
    this.store.updateQueryShow(this.store.queryText);
  }

  public sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  public capitalizeFirstCharacter (word: string) {
    const capitalized = word.charAt(0).toUpperCase() + word.slice(1)
    return capitalized;
  }
}
