export interface IProperty {
  propertyName: string,
  url: string,
  height: string,
  width: string,
  [key: string]: string
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
}
