import { Style } from './style';

export interface BodyItem {
  id?: number;
  name: string;
  src?: string;
  content?: any;
  styles?: Style[];
  bodyItem: BodyItem[];
  attribute?: Style[];
}
