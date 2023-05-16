import { ComponentStore } from '@ngrx/component-store';
import { Injectable } from '@angular/core';
import { IProperty, ITemplate } from 'src/app/app.constant';

const state = {
  properties: [
    {
      id: '1',
      propertyName: 'logo',
      url: 'https://kenh14cdn.com/thumb_w/660/2019/10/23/photo982704-157183520397083705394.jpg',
      height: 'unset',
      width: '200',
      queryFile: 'emails_content',
      updateWhere: 'trigger,topID',
    },
    {
      id: '2',
      propertyName: 'Replacements',
      queryFile: 'emails_replacements',
      updateWhere: 'emailID',
      disableAction: 'review_Template, select_query, update_query',
      notInput: 'true'
    },
    {
      id: '3',
      propertyName: 'palette',
      folder: '',
      queryFile: 'theme_palette',
      disableAction: 'review_Template, select_query, update_query',
      updateWhere: 'colorID'
    }
  ] as IProperty[],

  queryText: '' as string,
  queryShow: '' as string,
  isProcess: false as boolean,
  editQuery: false as boolean,
  isQueryInsert: true as boolean,
  isEditingRawFile: false as boolean,
  isShowTemplate: false as boolean,
  errorText: 'Error to convert raw file !' as string,
  emailTemplates: [] as ITemplate[],
  emailTemplateIndex: 0 as number,
  listQuerySelect: new Set<number>(),
  isSelectQuery: false as boolean,
  searchValue: '' as string,
  searchResult: [] as ITemplate[],
  listOptionQuery: [] as ITemplate[],
  htmlContent: '' as string,
  currentTab: {} as IProperty
}

type State = typeof state;

@Injectable()
export class EmailContentStore extends ComponentStore<State> {
  constructor() {
    super(state);
  }

  get properties(): IProperty[] { return this.get().properties; }

  get queryText(): string { return this.get().queryText; }
  public updateQueryText(newText: string) { this.patchState({ queryText: newText }); }

  get queryShow(): string { return this.get().queryShow; }
  public updateQueryShow(newText: string) { this.patchState({ queryShow: newText }); }

  get isProcess(): boolean { return this.get().isProcess; }
  updateIsProcess(value: boolean) { this.patchState({ isProcess: value }); }

  get editQuery(): boolean { return this.get().editQuery; }
  updateEditQuery(value: boolean) { this.patchState({ editQuery: value }); }

  get isQueryInsert(): boolean { return this.get().isQueryInsert; }
  updateQueryInsert(value: boolean) { this.patchState({ isQueryInsert: value }); }

  get isEditingRawFile(): boolean { return this.get().isEditingRawFile; }
  updateEditingRawFile(value: boolean) { this.patchState({ isEditingRawFile: value }); }

  get errorText(): string { return this.get().errorText; }

  get emailTemplateIndex(): number { return this.get().emailTemplateIndex; }
  updateEmailTemplateIndex(value: number) { this.patchState({ emailTemplateIndex: value }); }

  get isShowTemplate(): boolean { return this.get().isShowTemplate; }
  updateShowTemplate(value: boolean) { this.patchState({ isShowTemplate: value }); }

  get listQuerySelect(): Set<number> { return this.get().listQuerySelect; }
  updateListQuerySelect(value: Set<number>) { this.patchState({ listQuerySelect: value }); }
  clearListQuerySelect() {
    this.patchState({
      listQuerySelect: new Set<number>()
    })
  }

  get emailTemplates(): ITemplate[] { return this.get().emailTemplates; }
  updateEmailTemplates(newTemplate: ITemplate) {
    this.patchState({
      emailTemplates: [...this.emailTemplates, newTemplate]
    });
  }

  get isSelectQuery(): boolean { return this.get().isSelectQuery; }
  updateSelectQuery(value: boolean) { this.patchState({ isSelectQuery: value }); }

  get searchValue(): string { return this.get().searchValue; }
  updateSearchValue(value: string) { this.patchState({ searchValue: value }); }

  get searchResult() { return this.get().searchResult; }
  updateSearchResult(data: ITemplate[]) {
    this.patchState({
      searchResult: [...data]
    })
  }

  get listOptionQuery(): ITemplate[] { return this.get().listOptionQuery; }
  updateOptionQuery(options: ITemplate[]) {
    this.patchState({
      listOptionQuery: [...options]
    })
  }

  get htmlContent(): string { return this.get().htmlContent; }
  updateHTMLContent(value: string) {
    this.patchState({
      htmlContent: value
    })
  }

  get currentTab(): IProperty { return this.get().currentTab }
  updateCurrentTab(tab: IProperty) { console.log(tab); this.patchState({ currentTab: tab }) }
}
