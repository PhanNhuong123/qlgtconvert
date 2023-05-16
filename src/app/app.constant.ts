export interface IProperty {
  id: string
  propertyName: string,
  url?: string,
  height?: string,
  width?: string,
  folder?: string,
  queryFile: string,
  updateWhere: string,
  disableAction: string,
  notInput?: string
}

export interface ITemplate {
  id: number;
  email: string;
  htmlContent: string
}

export enum EProperty {
  HEIGHT = 'height',
  WIDTH = 'width',
  URL = 'url',
  FOLDER = 'folder'
}

export enum EFeatureQuery {
  REVIEW = 'review_template',
  SELECT = 'select_query',
  UPDATE = 'update_query'
}
