export interface IProperty {
  label: string;
  tableName: string;
  link: string;
  nameSpace: string;
  model: string;
}

export interface ITabProperty {
  id: string;
  fileName: string;
  type: ETab;
}

export interface IPropertyModel {
  isRequired: boolean;
  maxLength?: number;
  propertyName: string;
  label: string;
  type: string;
}

export interface ITemplate {
  id: number;
  email: string;
  htmlContent: string
}

export enum EProperty {
  LABEL = 'label',
  NAMESPACE = 'nameSpace',
  TABLE_NAME = 'tableName',
  MODEL = 'model',
  LINK = 'link',
}

export enum EFeatureQuery {
  REVIEW = 'review_template',
  SELECT = 'select_query',
  UPDATE = 'update_query'
}

export enum ETab {
  ENTITY = 'entity',
  DTO = 'dto',
  I_APP_SERVICE = 'iAppService',
  APP_SERVICE = 'appService',
  DANH_SACH_CS = 'danhSachCs',
  DANH_SACH_RAZOR = 'danhSachRazor',
  FORM_DIALOG_CS = 'FormDialogCs',
  FORM_DIALOG_RAZOR = 'FormDialogRazor',
  SEARCH_CS = 'SearchCs',
  SEARCH_RAZOR = 'SearchRazor'
}
