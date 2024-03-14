import { ComponentStore } from '@ngrx/component-store';
import { Injectable } from '@angular/core';
import { ETab, IProperty, IPropertyModel, ITabProperty, ITemplate } from 'src/app/app.constant';

const state = {
  properties: [
    {
      id: "1",
      fileName: "Entity",
      type: ETab.ENTITY
    },
    {
      id: "2",
      fileName: "Dto",
      type: ETab.DTO
    },
    {
      id: "3",
      fileName: "iAppService",
      type: ETab.I_APP_SERVICE
    },
    {
      id: "4",
      fileName: "appService",
      type: ETab.APP_SERVICE
    },
    {
      id: "5",
      fileName: "danhSachCs",
      type: ETab.DANH_SACH_CS
    },
    {
      id: "6",
      fileName: "danhSachRazor",
      type: ETab.DANH_SACH_RAZOR
    },
    {
      id: "7",
      fileName: "formDialogCs",
      type: ETab.FORM_DIALOG_CS
    },
    {
      id: "8",
      fileName: "formDialogRazor",
      type: ETab.FORM_DIALOG_RAZOR
    },
    {
      id: "9",
      fileName: "searchCs",
      type: ETab.SEARCH_CS
    },
    {
      id: "10",
      fileName: "searchRazor",
      type: ETab.SEARCH_RAZOR
    },
  ] as ITabProperty[],

  model: [] as Array<IPropertyModel>,
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
  currentTab: {} as ITabProperty,
  moduleInfo: {} as IProperty
}

type State = typeof state;

@Injectable()
export class EmailContentStore extends ComponentStore<State> {
  constructor() {
    super(state);
  }

  get properties(): ITabProperty[] { return this.get().properties; }

  get model(): Array<IPropertyModel> { return this.get().model; }
  public updateModel(newModel: Array<IPropertyModel>) { this.patchState({ model: newModel }); }

  get moduleInfo(): IProperty { return this.get().moduleInfo; }
  public updateModuleInfo(newModel: IProperty) { this.patchState({ moduleInfo: newModel }); }

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

  get currentTab(): ITabProperty { return this.get().currentTab }
  updateCurrentTab(tab: ITabProperty) { console.log(tab); this.patchState({ currentTab: tab }) }
}
