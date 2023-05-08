import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EProperty, ITemplate } from 'src/app/app.constant';
import { GlobalStore } from 'src/app/store/global.store';

@Component({
  selector: 'app-query-page',
  templateUrl: './query-page.component.html',
  styleUrls: ['./query-page.component.scss'],
})
export class QueryPageComponent {
  constructor(private httpClient: HttpClient, private store: GlobalStore, private router: Router) { }

  EProperty = EProperty;

  vm$ = this.store.select(state => {
    return {
      queryShow: state.queryShow,
      isProcess: state.isProcess,
      editQuery: state.editQuery,
      isQueryInsert: state.isQueryInsert,
      isEditingRawFile: state.isEditingRawFile,
      isSelectQuery: state.isSelectQuery,
      searchValue: state.searchValue,
      searchResult: state.searchResult,
      listQuerySelect: state.listQuerySelect
    }
  });

  get listOption(): ITemplate[] {
    if (this.store.searchResult.length > 0) {
      return this.store.searchResult;
    }
    return this.store.listOptionQuery;
  }
  public handleQueyChange(event: Event): void {
    if (event.target) {
      let value = (event.target as HTMLInputElement).value ?? '';
      this.store.updateQueryShow(value);
    }
  }
  public back(): void {
    this.store.updateIsProcess(false);
    this.store.updateEditQuery(false);
    this.router.navigateByUrl("");
  }
  public copyQuery(): void {
    navigator.clipboard.writeText(this.store.queryShow);
    alert('copied !!');
  }
  public openEditQuery(): void {
    this.store.updateEditQuery(true);
  }
  public handleShowTemplate(): void {
    this.store.updateShowTemplate(true);
    this.getListTemplate();
    this.router.navigateByUrl("/email-template-page")
  }
  public handleSelectingQuery(): void {
    this.httpClient
      .get('assets/emails_emailscontent.sql', { responseType: 'text' })
      .subscribe((queryText) => {
        if (queryText) {
          if (this.store.isSelectQuery) {
            this.store.updateListQuerySelect(this.store.listQuerySelect);
            const tables: string[] = queryText
              .split('INSERT INTO')
              .map((value) => 'INSERT INTO' + value);
            tables.shift();
            this.store.updateQueryText('');

            [...this.store.listQuerySelect].forEach(x => {
              tables.forEach(value => {
                if (value.includes(`VALUES (${x},`)) {
                  let newValue = this.store.queryText;
                  newValue += value;
                  this.store.updateQueryText(newValue);
                }
              })
            })
            this.changeQueryShow('insert');
            this.store.updateSelectQuery(false);
            this.store.updateEditingRawFile(false);
          } else {
            this.store.updateSelectQuery(true);
            this.store.updateListQuerySelect(this.store.listQuerySelect);
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
            this.store.updateOptionQuery(listSelect);
            if (this.store.listQuerySelect.size === 0) {
              this.selectAll();
            }
          }
        }
      });
  }
  public changeQueryShow(type: 'insert' | 'update'): void {
    if (this.store.isEditingRawFile) {
      this.store.updateEditingRawFile(false);
      this.store.updateQueryText(this.store.queryShow);
    }

    if (type === 'insert') {
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
  public closeEditQuery(): void {
    // this is save button
    this.store.updateEditQuery(false);
    if (this.store.isEditingRawFile) {
      this.store.updateEditingRawFile(false);
      this.store.updateQueryText(this.store.queryShow);
    }
  }

  public handleSearchChange(event: Event) {
    let value = ''
    if (event.target) {
      value = (event.target as HTMLInputElement)?.value ?? '';
      this.store.updateSearchValue(value);
    }
    if (value.length > 0) {
      let data = this.store.listOptionQuery.filter(x => x.email.toLocaleLowerCase().includes(value.toLocaleLowerCase()));
      this.store.updateSearchResult(data);
    } else {
      this.store.updateSearchResult([]);
    }
  }

  public selectAll() {
    if (this.store.searchResult.length > 0) {
      this.handleSelectSearchValue('select')
    } else {
      this.store.clearListQuerySelect();
      this.store.listOptionQuery.forEach(x => this.store.listQuerySelect.add(x.id))
    }
  }

  public deselectAll() {
    if (this.store.searchResult.length > 0) {
      this.handleSelectSearchValue('deselect')
    } else {
      this.store.clearListQuerySelect();
    }
  }

  public handleSelectSearchValue(action: 'select' | 'deselect'): void {
    if (this.store.searchResult.length > 0) {
      if (action === 'select') {
        this.store.searchResult.forEach(x => {
          if (!this.store.listQuerySelect.has(x.id)) {
            this.store.listQuerySelect.add(x.id);
          }
        })
      } else {
        this.store.searchResult.forEach(x => {
          this.store.listQuerySelect.delete(x.id)
        })
      }
    }
  }
  public clearSearchValue(): void {
    this.store.updateSearchValue('');
    this.store.updateSearchResult([]);
  }
  public handleClickOption(id: number): void {
    if (this.store.listQuerySelect.has(id)) {
      this.store.listQuerySelect.delete(id)
    } else {
      this.store.listQuerySelect.add(id)
    }
  }

  public editRawFile(): void {
    this.store.updateEditingRawFile(true);
    this.store.updateQueryShow(this.store.queryText);
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
          this.store.clearListQuerySelect();
        }
      });
    this.router.navigateByUrl("/query");
  }

  public rePlaceKeyCode(): void {
    let result = this.store.queryText;
    this.store.properties.forEach((property) => {

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

    this.store.updateQueryShow(result);
  }

  public capitalizeFirstCharacter(word: string) {
    const capitalized = word.charAt(0).toUpperCase() + word.slice(1)
    return capitalized;
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
    this.store.emailTemplates.length = 0;
    this.rePlaceKeyCode();

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

}
