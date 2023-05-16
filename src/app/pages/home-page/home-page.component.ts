import { EmailContentStore } from './../email-content.store';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { EProperty, IProperty, ITemplate } from 'src/app/app.constant';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent {

  constructor(private httpClient: HttpClient, private sanitizer: DomSanitizer, private emailContentStore: EmailContentStore, private router: Router) { }

  EProperty = EProperty;

  vm$ = this.emailContentStore.select(state => {
    return {
      properties: state.properties,
    }
  });


  public sanitize(url: string | undefined): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url ?? '');
  }

  public onInputChange(event: Event, property: IProperty, tap: keyof IProperty): void {
    event.preventDefault();
    if (property[tap] !== undefined) {
      property[tap] = (event.target as HTMLInputElement)?.value ?? '';
    }
  }

  public processing(): void {
    const queryFileName = this.emailContentStore.properties[0].queryFile.trim();

    this.httpClient
      .get(`assets/${queryFileName}.sql`, { responseType: 'text' })
      .subscribe((res) => {
        if (res) {
          this.emailContentStore.updateQueryText(res);
          this.rePlaceKeyCode();
          if (!this.emailContentStore.isQueryInsert) {
            this.convertAllInsertToUpdate();
          }
          this.getListTemplate();
          this.emailContentStore.updateIsProcess(true);
          this.emailContentStore.clearListQuerySelect();
        }
      });
    this.router.navigateByUrl("/query");
    this.emailContentStore.updateCurrentTab(this.emailContentStore.properties.find(x => x.queryFile === queryFileName) ?? this.emailContentStore.properties[0])
  }

  public rePlaceKeyCode(): void {
    let result = this.emailContentStore.queryText;
    this.emailContentStore.properties.forEach((property) => {

      const keys = Object.keys(property).filter(
        (key) => key !== 'propertyName'
      );
      keys.forEach((key) => {
        if (key.trim().length >= 0) {
          result = result.replaceAll(
            `##${property.propertyName + this.capitalizeFirstCharacter(key)}##`,
            property[key as keyof IProperty] ?? ''
          );
        }
      });
    });

    this.emailContentStore.updateQueryShow(result);
  }

  public capitalizeFirstCharacter(word: string): string {
    const capitalized = word.charAt(0).toUpperCase() + word.slice(1);
    return capitalized;
  }

  public convertAllInsertToUpdate(): void {
    const tables: string[] = this.emailContentStore.queryShow
      .split('INSERT INTO')
      .map((value) => 'INSERT INTO' + value);
    tables.shift();
    this.emailContentStore.updateQueryShow('');
    tables.forEach((value) => {
      let newValue = this.emailContentStore.queryShow;
      newValue += this.convertInsertToUpdate(value);
      this.emailContentStore.updateQueryShow(newValue);
    });
  }

  public convertInsertToUpdate(insertQuery: string, removeId = true): string {
    const tableName =
      '`' +
      insertQuery.match(/(?<=(insert\s+into\s*[`'"]))\w+(?=['"`])/gi)?.[0] +
      '`';

    const columnsStartIndex = insertQuery.indexOf('(') + 1;
    const columns = insertQuery
      .slice(columnsStartIndex, insertQuery.indexOf(')'))
      .split(',');
    const trimmedColumns = columns.map((col) => col.trim());
    if (removeId) {
      trimmedColumns.shift();
    }

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

    if (removeId) {
      valuesList.shift();
    }

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

  public getListTemplate(): void {
    this.emailContentStore.emailTemplates.length = 0;
    this.rePlaceKeyCode();

    const tables: string[] = this.emailContentStore.queryShow
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
      this.emailContentStore.updateEmailTemplates(newTemplate);
    });
  }
}
