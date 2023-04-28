export const properties: IProperties[] = [{
  propertyName: 'logo',
  URL: '',
  Height: 'unset',
  Width: 'unset'
}]


export interface IProperties {
  propertyName: string,
  URL: string,
  Height: string,
  Width: string,
  [key: string]: string
}
