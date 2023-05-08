import { ComponentStore } from '@ngrx/component-store';
import { IProperty, ITemplate } from "../app.constant";
import { Injectable } from '@angular/core';

const state = {
  properties: [
    {
      propertyName: 'logo',
      url: '',
      height: 'unset',
      width: '200'
    }
  ] as IProperty[],

  queryText: '' as string,
  queryShow: '' as string,
  isProcess: false as boolean,
  editQuery: false as boolean,
  isQueryInsert: false as boolean,
  isEditingRawFile: false as boolean,
  isShowTemplate: false as boolean,
  errorText: 'Error to convert raw file !' as string,
  emailTemplates: [] as ITemplate[],
  emailTemplateIndex: 0 as number,
  listQuerySelect: new Set<number>()
}

type State = typeof state;

@Injectable()
export class GlobalStore extends ComponentStore<State> {
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
  updateQueryInsert(value: boolean) { this.patchState({ isQueryInsert: value });}

  get isEditingRawFile(): boolean { return this.get().isEditingRawFile; }
  updateEditingRawFile(value: boolean) { this.patchState({ isEditingRawFile: value }); }

  get errorText(): string { return this.get().errorText; }

  get emailTemplateIndex(): number { return this.get().emailTemplateIndex; }
  updateEmailTemplateIndex(value: number) { this.patchState({ emailTemplateIndex: value }); }

  get isShowTemplate(): boolean { return this.get().isShowTemplate; }
  updateShowTemplate(value: boolean) { this.patchState({ isShowTemplate: value }); }

  get listQuerySelect(): Set<number> { return this.get().listQuerySelect; }
  updateListQuerySelect(value: Set<number>) { this.patchState({ listQuerySelect: value }); }

  get emailTemplates(): ITemplate[] { return this.get().emailTemplates; }
  updateEmailTemplates(newTemplate: ITemplate) {
    this.patchState({
      emailTemplates: [...this.emailTemplates, newTemplate]
    })
  }

}
