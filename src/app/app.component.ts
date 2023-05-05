import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IProperties, ITemplate, properties } from './app.constant';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'email-content-tool';
  public queryText: string = '';
  public queryShow: string = '';
  public properties: IProperties[] = properties;
  public isProcess: boolean = false;
  public editQuery: boolean = false;
  public isQueryInset: boolean = true;
  public isEditingRawFile: boolean = false;
  public errorText = 'Error to convert raw file !';
  public emailTemplates: ITemplate[] = [];
  public isShowTemplate: boolean = false;
  public emailTemplateIndex: number = 0;
  public isSelectQuery: boolean = false;
  public listQuerySelect = new Set<number>();
  public listOptionQuery: ITemplate[] = [];
  public searchResult: ITemplate[] | null = null;
  public searchValue: string = '';

  constructor(
    private httpClient: HttpClient,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.httpClient
      .get('assets/emails_emailscontent.sql', { responseType: 'text' })
      .subscribe((res) => {
        if (res) {
          this.queryText = res;
        }
      });
  }

  public ChooseEmailTemplate(index: number): void {
    this.emailTemplateIndex = index ?? 1;
  }

  public getListTemplate(): void {
    this.emailTemplates.length = 0;
    this.rePlaceKeyCode();
    const tables: string[] = this.queryShow
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
      this.emailTemplates.push(newTemplate);
    });
  }

  public closeEmailTemplate(): void {
    this.isShowTemplate = false;
  }

  public handleShowTemplate(): void {
    this.isShowTemplate = true;
    this.getListTemplate();
  }

  public rePlaceKeyCode(): void {
    let result = this.queryText;
    this.properties.forEach((property) => {
      const keys = Object.keys(property).filter(
        (key) => key !== 'propertyName'
      );
      keys.forEach((key) => {
        if (key.trim().length >= 0) {
          result = result.replaceAll(
            `##${property.propertyName + key}##`,
            property[key] ?? ''
          );
        }
      });
    });
    this.queryShow = result;
  }

  public processing(): void {
    this.httpClient
      .get('assets/emails_emailscontent.sql', { responseType: 'text' })
      .subscribe((res) => {
        if (res) {
          this.queryText = res;
          this.rePlaceKeyCode();
          if (!this.isQueryInset) {
            this.convertAllInsertToUpdate();
          }
          this.getListTemplate();
          this.isProcess = true;
          this.listQuerySelect.clear();
        }
      });
  }

  public onInputChange(event: Event, property: IProperties, tap: string): void {
    event.preventDefault();
    if (property[tap] !== undefined) {
      property[tap] = (event.target as HTMLInputElement)?.value ?? '';
    }
  }

  public copyQuery(): void {
    navigator.clipboard.writeText(this.queryShow);
    alert('copied !!');
  }

  public back() {
    this.isProcess = false;
    this.editQuery = false;
  }

  public handleQueyChange(event: Event): void {
    if (event.target) {
      this.queryShow = (event.target as HTMLInputElement).value ?? '';
    }
  }

  public closeEditQuery(): void {
    this.editQuery = false;
    if (this.isEditingRawFile) {
      this.isEditingRawFile = false;
      this.queryText = this.queryShow;
    }
  }

  public openEditQuery(): void {
    this.editQuery = true;
  }

  public convertAllInsertToUpdate(): void {
    const tables: string[] = this.queryShow
      .split('INSERT INTO')
      .map((value) => 'INSERT INTO' + value);
    tables.shift();
    this.queryShow = '';
    tables.forEach((value) => {
      this.queryShow += this.convertInsertToUpdate(value);
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

  public changeQueryShow(type: 'inset' | 'update'): void {
    if (this.isEditingRawFile) {
      this.isEditingRawFile = false;
      this.queryText = this.queryShow;
    }

    if (type === 'inset') {
      this.isQueryInset = true;
      this.rePlaceKeyCode();
    } else if (type === 'update') {
      this.isQueryInset = false;
      this.rePlaceKeyCode();
      this.convertAllInsertToUpdate();
    }
    if (this.queryShow.trim().length === 0) {
      this.queryShow = this.errorText;
    }
  }

  public editRawFile(): void {
    this.isEditingRawFile = true;
    this.queryShow = this.queryText;
  }

  public sanitize(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  public handleSelectingQuery(): void {
    this.httpClient
      .get('assets/emails_emailscontent.sql', { responseType: 'text' })
      .subscribe((queryText) => {
        if (queryText) {
          if (this.isSelectQuery) {
            const tables: string[] = queryText
              .split('INSERT INTO')
              .map((value) => 'INSERT INTO' + value);
            tables.shift();
            this.queryText = '';

            [...this.listQuerySelect].forEach(x => {
              tables.forEach(value => {
                if (value.includes(`VALUES (${x},`)) {
                  this.queryText += value;
                }
              })
            })
            this.changeQueryShow('inset');
            this.isSelectQuery = false;
            this.isEditingRawFile = false;
          } else {
            this.isSelectQuery = true;
            const tables: string[] = queryText
              .split('INSERT INTO')
              .map((value) => 'INSERT INTO' + value);
            tables.shift();
            const listSelect: ITemplate[] = [];

            tables.forEach((tableQuery) => {
              const updateQuery = this.convertInsertToUpdate(tableQuery, false);
              const htmlContent: string =
                /(?<=htmlcontent\s*[`']\s*=\s*[`']).*(?='\s*,\s*[`']userID[`'])/gi.exec(
                  updateQuery
                )?.[0] ?? '';
              const email: string =
                /(?<=title\s*[`']\s*=\s*[`']).*(?='\s*,\s*[`']subject[`'])/gi.exec(
                  updateQuery
                )?.[0] ?? '';
              const id: string =
                /(?<=ID\s*[`']\s*=\s*[`']?).*(?=[`']?\s*,\s*[`']isVendor[`'])/gi.exec(
                  updateQuery
                )?.[0] ?? '';
              const newTemplate: ITemplate = {
                id: Number(id.trim()),
                email: email,
                htmlContent: htmlContent.replaceAll(/\\r\\n|\\/gi, ''),
              };
              listSelect.push(newTemplate);
            });
            this.listOptionQuery = listSelect;
            if (this.listQuerySelect.size === 0) {
              this.selectAll();
            }
          }
        }
      });
  }

  handleSearchChange(event: Event) {
    let value = ''
    if (event.target) {
      value = (event.target as HTMLInputElement)?.value ?? '';
      this.searchValue = value;
    }
    if (value.length > 0) {
      this.searchResult = this.listOptionQuery.filter(x => x.email.toLocaleLowerCase().includes(value.toLocaleLowerCase()));
      this.searchResult = this.searchResult || null;
    } else {
      this.searchResult = null;
    }
  }

  get listOption() {
    if (this.searchResult) {
      return this.searchResult;
    }
    return this.listOptionQuery;
  }

  public handleClickOption(id: number): void {
    if (this.listQuerySelect.has(id)) {
      this.listQuerySelect.delete(id)
    } else {
      this.listQuerySelect.add(id)
    }
  }

  public selectAll() {
    if (this.searchResult) {
      this.handleSelectSearchValue('select')
    } else {
      this.listQuerySelect.clear();
      this.listOptionQuery.forEach(x => this.listQuerySelect.add(x.id))
    }
  }

  public deselectAll() {
    if (this.searchResult) {
      this.handleSelectSearchValue('unSelect')
    } else {
      this.listQuerySelect.clear();
    }
  }

  public handleSelectSearchValue(action: 'select' | 'unSelect'): void {
    if (this.searchResult !== null) {
      if (action === 'select') {
        this.searchResult.forEach(x => {
          if (!this.listQuerySelect.has(x.id)) {
            this.listQuerySelect.add(x.id);
          }
        })
      } else {
        this.searchResult.forEach(x => {
          this.listQuerySelect.delete(x.id)
        })
      }
    }
  }

  public clearSearchValue(): void {
    this.searchValue = '';
    this.searchResult = null;
  }
}
