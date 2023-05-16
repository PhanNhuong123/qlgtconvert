import { EmailContentStore } from './../email-content.store';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EFeatureQuery, EProperty, IProperty, ITemplate } from 'src/app/app.constant';


@Component({
  selector: 'app-query-page',
  templateUrl: './query-page.component.html',
  styleUrls: ['./query-page.component.scss'],
})
export class QueryPageComponent {
  constructor(private emailContentStore: EmailContentStore, private httpClient: HttpClient, private router: Router) { }

  public listQuerySelect = new Set<number>();

  EProperty = EProperty;
  EFeatureQuery = EFeatureQuery;

  vm$ = this.emailContentStore.select(state => {
    return {
      queryShow: state.queryShow,
      isProcess: state.isProcess,
      editQuery: state.editQuery,
      isQueryInsert: state.isQueryInsert,
      isEditingRawFile: state.isEditingRawFile,
      isSelectQuery: state.isSelectQuery,
      searchValue: state.searchValue,
      searchResult: state.searchResult,
      listQuerySelect: state.listQuerySelect,
      properties: state.properties,
      currentTab: state.currentTab
    }
  });

  get listOption(): ITemplate[] {
    if (this.emailContentStore.searchResult.length > 0) {
      return this.emailContentStore.searchResult;
    }
    return this.emailContentStore.listOptionQuery;
  }
  public handleQueyChange(event: Event): void {
    if (event.target) {
      let value = (event.target as HTMLInputElement).value ?? '';
      this.emailContentStore.updateQueryShow(value);
    }
  }
  public back(): void {
    this.emailContentStore.updateIsProcess(false);
    this.emailContentStore.updateEditQuery(false);
    this.router.navigateByUrl("");
  }
  public copyQuery(): void {
    navigator.clipboard.writeText(this.emailContentStore.queryShow);
    alert('copied !!');
  }
  public openEditQuery(): void {
    this.emailContentStore.updateEditQuery(true);
  }
  public handleShowTemplate(): void {
    this.emailContentStore.updateShowTemplate(true);
    this.getListTemplate();
    this.router.navigateByUrl("/email-template-page")
  }
  public handleSelectingQuery(): void {
    this.httpClient
      .get(`assets/${this.emailContentStore.currentTab.queryFile}.sql`, { responseType: 'text' })
      .subscribe((queryText) => {
        if (queryText) {
          if (this.emailContentStore.isSelectQuery) {
            this.emailContentStore.updateListQuerySelect(this.listQuerySelect);
            const tables: string[] = queryText
              .split('INSERT INTO')
              .map((value) => 'INSERT INTO' + value);
            tables.shift();
            this.emailContentStore.updateQueryText('');
            let newValue = '';
            [...this.listQuerySelect].forEach(x => {
              tables.forEach(value => {
                if (value.includes(`VALUES (${x},`)) {
                  newValue += value;
                }
              })
            })
            this.emailContentStore.updateQueryText(newValue);
            this.changeQueryShow('insert');
            this.emailContentStore.updateSelectQuery(false);
            this.emailContentStore.updateEditingRawFile(false);
          } else {
            this.listQuerySelect = new Set(this.emailContentStore.listQuerySelect);
            this.emailContentStore.updateSelectQuery(true);
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
            this.emailContentStore.updateOptionQuery(listSelect);
            if (this.listQuerySelect.size === 0) {
              this.selectAll();
            }
          }
        }
      });
  }

  public cancelQuerySelect() {
    this.emailContentStore.updateSelectQuery(false);
  }

  public changeQueryShow(type: 'insert' | 'update'): void {
    if (this.emailContentStore.isEditingRawFile) {
      this.emailContentStore.updateEditingRawFile(false);
      this.emailContentStore.updateQueryText(this.emailContentStore.queryShow);
    }

    if (type === 'insert') {
      this.emailContentStore.updateQueryInsert(true);
      this.rePlaceKeyCode();
    } else if (type === 'update') {
      this.emailContentStore.updateQueryInsert(false);
      this.rePlaceKeyCode();
      this.convertAllInsertToUpdate();
    }
    if (this.emailContentStore.queryShow.trim().length === 0) {
      this.emailContentStore.updateQueryShow(this.emailContentStore.errorText);
    }
  }
  public closeEditQuery(): void {
    // this is save button
    this.emailContentStore.updateEditQuery(false);
    if (this.emailContentStore.isEditingRawFile) {
      this.emailContentStore.updateEditingRawFile(false);
      this.emailContentStore.updateQueryText(this.emailContentStore.queryShow);
    }
  }

  public handleSearchChange(event: Event): void {
    let value = ''
    if (event.target) {
      value = (event.target as HTMLInputElement)?.value ?? '';
      this.emailContentStore.updateSearchValue(value);
    }
    if (value.length > 0) {
      let data = this.emailContentStore.listOptionQuery.filter(x => x.email.toLocaleLowerCase().includes(value.toLocaleLowerCase()));
      this.emailContentStore.updateSearchResult(data);
    } else {
      this.emailContentStore.updateSearchResult([]);
    }
  }

  public selectAll(): void {
    if (this.emailContentStore.searchResult.length > 0) {
      this.handleSelectSearchValue('select')
    } else {
      this.emailContentStore.clearListQuerySelect();
      this.emailContentStore.listOptionQuery.forEach(x => this.listQuerySelect.add(x.id))
    }
  }

  public deselectAll(): void {
    if (this.emailContentStore.searchResult.length > 0) {
      this.handleSelectSearchValue('deselect')
    } else {
      this.listQuerySelect.clear();
    }
  }

  public handleSelectSearchValue(action: 'select' | 'deselect'): void {
    if (this.emailContentStore.searchResult.length > 0) {
      if (action === 'select') {
        this.emailContentStore.searchResult.forEach(x => {
          if (!this.listQuerySelect.has(x.id)) {
            this.listQuerySelect.add(x.id);
          }
        })
      } else {
        this.emailContentStore.searchResult.forEach(x => {
          this.listQuerySelect.delete(x.id);
        })
      }
    }
  }
  public clearSearchValue(): void {
    this.emailContentStore.updateSearchValue('');
    this.emailContentStore.updateSearchResult([]);
  }

  public handleClickOption(id: number): void {
    if (this.listQuerySelect.has(id)) {
      this.listQuerySelect.delete(id);
    } else {
      this.listQuerySelect.add(id);
    }
  }

  public editRawFile(): void {
    this.emailContentStore.updateEditingRawFile(true);
    this.emailContentStore.updateQueryShow(this.emailContentStore.queryText);
  }

  public processing(): void {
    this.httpClient
      .get(`assets/${this.emailContentStore.currentTab.queryFile}.sql`, { responseType: 'text' })
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
    this.emailContentStore.updateQueryInsert(true);
    this.emailContentStore.updateEditingRawFile(false);
    this.router.navigateByUrl("/query");
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
    const capitalized = word.charAt(0).toUpperCase() + word.slice(1)
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

    let whereClauses = '';

    const listKey = this.emailContentStore.properties.find(x => x.id === this.emailContentStore.currentTab.id)?.updateWhere.split(',');
    listKey?.forEach(key => {
      const index = trimmedColumns.findIndex(value => value === ('`' + key + '`'));
      if (whereClauses.length > 0) {
        whereClauses += ' && ' + '`' + key + '`' + ' = ' + trimmedValues[index];
      } else {
        whereClauses += '`' + key + '`' + ' = ' + trimmedValues[index];
      }
    })

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

  public updateCurrentTab(prop: IProperty): void {
    this.emailContentStore.updateCurrentTab(prop);
    this.processing();
  }

  public unDisable(featName: string, property?: IProperty): boolean {
    const disableString: string = property?.disableAction ?? this.emailContentStore.currentTab.disableAction;
    if (disableString) {
      return disableString?.split(',').findIndex(value => value.trim() === featName.trim()) === 0;
    }
    return true;
  }
}