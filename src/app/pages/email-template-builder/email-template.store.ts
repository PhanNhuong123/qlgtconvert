import { Style } from './../../model/style';
import { ComponentStore } from '@ngrx/component-store';
import { Injectable, Renderer2 } from '@angular/core';
import { basetemplate } from 'src/app/constants/basetemplate';
import { BodyItem } from 'src/app/model/body-item';
import { saveAs } from 'file-saver';


const state = {
  bodyItem: basetemplate.bodyItem as BodyItem[],
  activeItem: '' as BodyItem | any,
  currentId: 0 as number,
  activeLinkIndex: 1 as number,
  showLoading: false as boolean,
  showPropertiesSidebar: false as boolean,
  htmlTemplate: '' as string,
  showAddNewElementModal: false as boolean,
}

type State = typeof state;

@Injectable()
export class EmailTemplateBuilderStore extends ComponentStore<State> {
  constructor() {
    super(state);
    this.getCurrentId(this.bodyItem);
    this.getHtmlTemplate();
    const bodyHtmlString = this.buildHtmlString(this.bodyItem);
  }

  get htmlTemplate() {
    return this.get().htmlTemplate;
  }

  get bodyItem() {
    return this.get().bodyItem;
  }

  get activeItem() {
    return this.get().activeItem;
  }

  get currentId() {
    return this.get().currentId;
  }

  get showAddNewElementModal() {
    return this.get().showAddNewElementModal;
  }

  saveTemplate() {
    console.log('this.bodyItem: \n', JSON.stringify(this.bodyItem));
  }

  exportFile(): void {
    this.getHtmlTemplate();
    const blob = new Blob([this.htmlTemplate], {
      type: 'text/html;charset=utf-8',
    });
    const dataTime = new Date().toLocaleString();
    saveAs(blob, `template_${dataTime.toString()}.html`);
  }

  toggleAddNewElementModal() {
    this.patchState({ showAddNewElementModal: !this.showAddNewElementModal });
  }

  addAlignCenterStyle(itemAdded: BodyItem) {
    this.findItemToAddAlignCenterStyle(this.bodyItem, itemAdded);
  }

  addAlignLeftStyle(itemAdded: BodyItem) {
    this.findItemToAddAlignLeftStyle(this.bodyItem, itemAdded);
  }

  addAlignRightStyle(itemAdded: BodyItem) {
    this.findItemToAddAlignRightStyle(this.bodyItem, itemAdded);
  }

  addChangeContent(itemAdded: BodyItem, content: string) {
    this.findItemToAddChangeContent(this.bodyItem, itemAdded, content);
  }

  addItemStyle(itemAdded: BodyItem, style: Style) {
    this.findItemToAddStyle(this.bodyItem, itemAdded, style);
  }

  addFontBoldStyle(itemAdded: BodyItem) {
    this.findItemToAddFontBold(this.bodyItem, itemAdded);
  }

  addFontItalicStyle(itemAdded: BodyItem) {
    this.findItemToAddFontItalic(this.bodyItem, itemAdded);
  }

  addFontUnderlineStyle(itemAdded: BodyItem) {
    this.findItemToAddFontUnderline(this.bodyItem, itemAdded);
  }

  addWidthStyle(itemAdded: BodyItem, width: string) {
    if (width !== '') {
    } else {
      width = '100%';
    }
    this.findItemToAddWidthStyle(this.bodyItem, itemAdded, width);
  }

  findItemToAddWidthStyle(
    bodyItem: BodyItem[],
    itemAdded: BodyItem,
    width: string
  ) {
    const style: Style = { prop: 'width', value: `${width}` };
    bodyItem.forEach((item: BodyItem) => {
      if (itemAdded.id === item.id) {
        const styles = item.styles?.filter((x) => x.prop !== style.prop);
        item.styles = styles;
        item.styles?.push(style);
        return;
      }
      if (Array.isArray(item.bodyItem)) {
        return this.findItemToAddWidthStyle(item.bodyItem, itemAdded, width);
      }
    });
  }

  addHeightStyle(itemAdded: BodyItem, height: string) {
    if (height !== '') {
    } else {
      height = '100%';
    }
    this.findItemToAddHeightStyle(this.bodyItem, itemAdded, height);
  }

  findItemToAddHeightStyle(
    bodyItem: BodyItem[],
    itemAdded: BodyItem,
    height: string
  ) {
    const style: Style = { prop: 'height', value: `${height}` };
    bodyItem.forEach((item: BodyItem) => {
      if (itemAdded.id === item.id) {
        const styles = item.styles?.filter((x) => x.prop !== style.prop);
        item.styles = styles;
        item.styles?.push(style);
        return;
      }
      if (Array.isArray(item.bodyItem)) {
        return this.findItemToAddHeightStyle(item.bodyItem, itemAdded, height);
      }
    });
  }

  addPaddingTopBottomStyle(itemAdded: BodyItem, pixel: string) {
    let pixelTop = '0';
    let pixelBottom = '0';
    if (pixel !== '') {
      let index = pixel.indexOf(',');
      pixelTop = pixel.substring(0, index);
      pixelBottom = pixel.substring(index + 1, pixel.length);
    }
    this.findItemToAddPaddingTop(this.bodyItem, itemAdded, pixelTop);
    this.findItemToAddPaddingBottom(this.bodyItem, itemAdded, pixelBottom);
  }

  addPaddingLeftRightStyle(itemAdded: BodyItem, pixel: string) {
    let pixelLeft = '0';
    let pixelRight = '0';
    if (pixel !== '') {
      let index = pixel.indexOf(',');
      pixelLeft = pixel.substring(0, index);
      pixelRight = pixel.substring(index + 1, pixel.length);
    }
    this.findItemToAddPaddingLeft(this.bodyItem, itemAdded, pixelLeft);
    this.findItemToAddPaddingRight(this.bodyItem, itemAdded, pixelRight);
  }

  addMarginTopBottomStyle(itemAdded: BodyItem, pixel: string) {
    let pixelTop = '0';
    let pixelBottom = '0';
    if (pixel !== '') {
      let index = pixel.indexOf(',');
      pixelTop = pixel.substring(0, index);
      pixelBottom = pixel.substring(index + 1, pixel.length);
    }
    this.findItemToAddMarginTop(this.bodyItem, itemAdded, pixelTop);
    this.findItemToAddMarginBottom(this.bodyItem, itemAdded, pixelBottom);
  }

  addMarginLeftRightStyle(itemAdded: BodyItem, pixel: string) {
    let pixelLeft = '0';
    let pixelRight = '0';
    if (pixel !== '') {
      let index = pixel.indexOf(',');
      pixelLeft = pixel.substring(0, index);
      pixelRight = pixel.substring(index + 1, pixel.length);
    }
    this.findItemToAddMarginLeft(this.bodyItem, itemAdded, pixelLeft);
    this.findItemToAddMarginRight(this.bodyItem, itemAdded, pixelRight);
  }

  getHtmlTemplate() {
    this.patchState({
      htmlTemplate: `<!DOCTYPE html>
                      <html lang="en">
                        <head>
                          <meta charset="utf-8" />
                          <title>Email Template Builder</title>
                          <base href="/" />
                          <meta name="viewport" content="width=device-width, initial-scale=1" />
                          <link rel="icon" type="image/x-icon" href="favicon.ico" />
                        </head> <body style="background-color:#e8e8e8;border:none; font-family: Arial, Helvetica, sans-serif; display: flex; flex-direction: column; justify-content: center; align-items: center;">
                      <table border="0" cellspacing="0" cellpadding="0" style="width: 640px; height: fit-content;border-collapse: collapse;"><tbody><tr><td>
                      ${this.buildHtmlString(
                        this.bodyItem
                      )}</td></tr></tbody></table></body></html>`,
    });
  }

  buildHtmlString(bodyItem: BodyItem[]): string {
    let htmlString = '';
    bodyItem.forEach((item) => {
      htmlString += `<${item.name}`;
      if (item.styles) {
        htmlString += ' style= " ';

        item.styles.forEach((style: Style) => {
          htmlString += `${style.prop}:${style.value};`;
        });
        htmlString += '"';
        if (item.src) {
          htmlString += ' src="' + item.src + '" ';
        }
      }
      if (item.attribute) {
        item.attribute.forEach((attr: Style) => {
          htmlString += ` ${attr.prop}="${attr.value}" `;
        });
      }

      htmlString += '>';

      if (item.content) {
        htmlString += item.content;
      }

      if (item.bodyItem && item.bodyItem.length) {
        htmlString += this.buildHtmlString(item.bodyItem);
      }

      if (item.name !== 'img') {
        htmlString += `</${item.name}>`;
      }
    });

    return htmlString;
  }

  findItemToAdd(bodyItem: BodyItem[], addedItem: any) {
    bodyItem.forEach((item: BodyItem) => {
      if (item.name === 'td' && Array.isArray(item.bodyItem)) {
        if (this.activeItem.id === item.id) {
          item.bodyItem.push(addedItem);
          this.setActiveItem(addedItem);
          return;
        }
        if (Array.isArray(item.bodyItem)) {
          return this.findItemToAdd(item.bodyItem, addedItem);
        }
      } else {
        if (Array.isArray(item.bodyItem)) {
          return this.findItemToAdd(item.bodyItem, addedItem);
        }
      }
    });
  }

  addText() {
    this.patchState({ currentId: this.currentId + 1 });
    let addedItem: BodyItem = {
      id: this.currentId,
      name: 'a',
      content: 'Example text',
      styles: [
        {
          prop: 'margin-right',
          value: 'auto',
        },
      ],
      bodyItem: [],
    };

    this.findItemToAdd(this.bodyItem, addedItem);
  }

  addButton() {
    this.patchState({ currentId: this.currentId + 1 });
    let addedItem: BodyItem = {
      id: this.currentId,
      name: 'button',
      content: 'Example Button',
      styles: [
        {
          prop: 'background-color',
          value: 'blue',
        },
        {
          prop: 'border',
          value: '1px solid blue',
        },
        {
          prop: 'color',
          value: 'white',
        },
        {
          prop: 'margin-right',
          value: 'auto',
        },

        {
          prop: 'padding-left',
          value: '10px',
        },
        {
          prop: 'padding-right',
          value: '10px',
        },

        {
          prop: 'width',
          value: 'fit-content',
        },
      ],
      bodyItem: [],
    };

    this.findItemToAdd(this.bodyItem, addedItem);
  }

  addImage() {
    this.patchState({ currentId: this.currentId + 1 });
    let addedItem: BodyItem = {
      id: this.currentId,
      src: 'https://via.placeholder.com/576x282.png?text=Example Image',
      name: 'img',
      styles: [],
      content: '',
      bodyItem: [],
    };

    this.findItemToAdd(this.bodyItem, addedItem);
  }

  findItemToAddAlignCenterStyle(bodyItem: BodyItem[], itemAdded: BodyItem) {
    const alignRemove: Style[] = [
      { prop: 'display', value: 'flex' },
      { prop: 'justify-content', value: 'center' },
      { prop: 'margin-left', value: 'auto' },
      { prop: 'margin-right', value: 'auto' },
    ];
    const align: Style[] = [
      { prop: 'display', value: 'flex' },
      { prop: 'justify-content', value: 'center' },
      { prop: 'margin-left', value: 'auto' },
      { prop: 'margin-right', value: 'auto' },
    ];
    bodyItem.forEach((item: BodyItem) => {
      if (itemAdded.id === item.id) {
        alignRemove.forEach((i) => {
          const styles = item.styles?.filter((x) => x.prop !== i.prop);
          item.styles = styles;
        });
        align.forEach((i) => {
          item.styles?.push(i);
        });
      }
      if (Array.isArray(item.bodyItem)) {
        return this.findItemToAddAlignCenterStyle(item.bodyItem, itemAdded);
      }
    });
  }

  findItemToAddAlignLeftStyle(bodyItem: BodyItem[], itemAdded: BodyItem) {
    const alignRemove: Style[] = [
      { prop: 'display', value: 'flex' },
      { prop: 'justify-content', value: 'center' },
      { prop: 'margin-left', value: 'auto' },
      { prop: 'margin-right', value: 'auto' },
    ];
    const align: Style[] = [
      { prop: 'display', value: 'flex' },
      { prop: 'justify-content', value: 'start' },
      { prop: 'margin-right', value: 'auto' },
    ];
    bodyItem.forEach((item: BodyItem) => {
      if (itemAdded.id === item.id) {
        alignRemove.forEach((i) => {
          const styles = item.styles?.filter((x) => x.prop !== i.prop);
          item.styles = styles;
        });
        align.forEach((i) => {
          item.styles?.push(i);
        });
      }
      if (Array.isArray(item.bodyItem)) {
        return this.findItemToAddAlignLeftStyle(item.bodyItem, itemAdded);
      }
    });
  }

  findItemToAddAlignRightStyle(bodyItem: BodyItem[], itemAdded: BodyItem) {
    const alignRemove: Style[] = [
      { prop: 'display', value: 'flex' },
      { prop: 'justify-content', value: 'center' },
      { prop: 'margin-left', value: 'auto' },
      { prop: 'margin-right', value: 'auto' },
    ];
    const align: Style[] = [
      { prop: 'display', value: 'flex' },
      { prop: 'justify-content', value: 'end' },
      { prop: 'margin-left', value: 'auto' },
    ];
    bodyItem.forEach((item: BodyItem) => {
      if (itemAdded.id === item.id) {
        alignRemove.forEach((i) => {
          const styles = item.styles?.filter((x) => x.prop !== i.prop);
          item.styles = styles;
        });
        align.forEach((i) => {
          item.styles?.push(i);
        });
      }
      if (Array.isArray(item.bodyItem)) {
        return this.findItemToAddAlignRightStyle(item.bodyItem, itemAdded);
      }
    });
  }

  findItemToAddChangeContent(
    bodyItem: BodyItem[],
    itemAdded: BodyItem,
    content: string
  ) {
    bodyItem.forEach((item: BodyItem) => {
      if (itemAdded.id === item.id) {
        item.content = content;
        return;
      }
      if (Array.isArray(item.bodyItem)) {
        return this.findItemToAddChangeContent(
          item.bodyItem,
          itemAdded,
          content
        );
      }
    });
  }

  findItemToAddFontBold(bodyItem: BodyItem[], itemAdded: BodyItem) {
    const style: Style = { prop: 'font-weight', value: 'bold' };
    bodyItem.forEach((item: BodyItem) => {
      if (itemAdded.id === item.id) {
        const styles = item.styles?.filter((x) => x.prop !== style.prop);
        const elementIndex = item.styles?.findIndex(
          (x) => x.prop === style.prop
        );
        item.styles = styles;
        if (elementIndex === -1) {
          item.styles?.push(style);
          return;
        }
      }
      if (Array.isArray(item.bodyItem)) {
        return this.findItemToAddFontBold(item.bodyItem, itemAdded);
      }
    });
  }

  findItemToAddFontItalic(bodyItem: BodyItem[], itemAdded: BodyItem) {
    const style: Style = { prop: 'font-style', value: 'italic' };
    bodyItem.forEach((item: BodyItem) => {
      if (itemAdded.id === item.id) {
        const styles = item.styles?.filter((x) => x.prop !== style.prop);
        const elementIndex = item.styles?.findIndex(
          (x) => x.prop === style.prop
        );
        item.styles = styles;
        if (elementIndex === -1) {
          item.styles?.push(style);
          return;
        }
      }
      if (Array.isArray(item.bodyItem)) {
        return this.findItemToAddFontItalic(item.bodyItem, itemAdded);
      }
    });
  }

  findItemToAddFontUnderline(bodyItem: BodyItem[], itemAdded: BodyItem) {
    const style: Style = { prop: 'text-decoration', value: 'underline' };
    bodyItem.forEach((item: BodyItem) => {
      if (itemAdded.id === item.id) {
        const styles = item.styles?.filter((x) => x.prop !== style.prop);
        const elementIndex = item.styles?.findIndex(
          (x) => x.prop === style.prop
        );
        item.styles = styles;
        if (elementIndex === -1) {
          item.styles?.push(style);
          return;
        }
      }
      if (Array.isArray(item.bodyItem)) {
        return this.findItemToAddFontUnderline(item.bodyItem, itemAdded);
      }
    });
  }

  findItemToAddPaddingTop(
    bodyItem: BodyItem[],
    itemAdded: BodyItem,
    pixel: string
  ) {
    const style: Style = { prop: 'padding-top', value: `${pixel}px` };
    bodyItem.forEach((item: BodyItem) => {
      if (itemAdded.id === item.id) {
        const styles = item.styles?.filter((x) => x.prop !== style.prop);
        item.styles = styles;
        item.styles?.push(style);
        return;
      }
      if (Array.isArray(item.bodyItem)) {
        return this.findItemToAddPaddingTop(item.bodyItem, itemAdded, pixel);
      }
    });
  }

  findItemToAddPaddingBottom(
    bodyItem: BodyItem[],
    itemAdded: BodyItem,
    pixel: string
  ) {
    const style: Style = { prop: 'padding-bottom', value: `${pixel}px` };
    bodyItem.forEach((item: BodyItem) => {
      if (itemAdded.id === item.id) {
        const styles = item.styles?.filter((x) => x.prop !== style.prop);
        item.styles = styles;
        item.styles?.push(style);
        return;
      }
      if (Array.isArray(item.bodyItem)) {
        return this.findItemToAddPaddingBottom(item.bodyItem, itemAdded, pixel);
      }
    });
  }

  findItemToAddPaddingLeft(
    bodyItem: BodyItem[],
    itemAdded: BodyItem,
    pixel: string
  ) {
    const style: Style = { prop: 'padding-left', value: `${pixel}px` };
    bodyItem.forEach((item: BodyItem) => {
      if (itemAdded.id === item.id) {
        const styles = item.styles?.filter((x) => x.prop !== style.prop);
        item.styles = styles;
        item.styles?.push(style);
        return;
      }
      if (Array.isArray(item.bodyItem)) {
        return this.findItemToAddPaddingLeft(item.bodyItem, itemAdded, pixel);
      }
    });
  }

  findItemToAddPaddingRight(
    bodyItem: BodyItem[],
    itemAdded: BodyItem,
    pixel: string
  ) {
    const style: Style = { prop: 'padding-right', value: `${pixel}px` };
    bodyItem.forEach((item: BodyItem) => {
      if (itemAdded.id === item.id) {
        const styles = item.styles?.filter((x) => x.prop !== style.prop);
        item.styles = styles;
        item.styles?.push(style);
        return;
      }
      if (Array.isArray(item.bodyItem)) {
        return this.findItemToAddPaddingRight(item.bodyItem, itemAdded, pixel);
      }
    });
  }

  findItemToAddMarginTop(
    bodyItem: BodyItem[],
    itemAdded: BodyItem,
    pixel: string
  ) {
    const style: Style = { prop: 'margin-top', value: `${pixel}px` };
    bodyItem.forEach((item: BodyItem) => {
      if (itemAdded.id === item.id) {
        const styles = item.styles?.filter((x) => x.prop !== style.prop);
        item.styles = styles;
        item.styles?.push(style);
        return;
      }
      if (Array.isArray(item.bodyItem)) {
        return this.findItemToAddMarginTop(item.bodyItem, itemAdded, pixel);
      }
    });
  }

  findItemToAddMarginBottom(
    bodyItem: BodyItem[],
    itemAdded: BodyItem,
    pixel: string
  ) {
    const style: Style = { prop: 'margin-bottom', value: `${pixel}px` };
    bodyItem.forEach((item: BodyItem) => {
      if (itemAdded.id === item.id) {
        const styles = item.styles?.filter((x) => x.prop !== style.prop);
        item.styles = styles;
        item.styles?.push(style);
        return;
      }
      if (Array.isArray(item.bodyItem)) {
        return this.findItemToAddMarginBottom(item.bodyItem, itemAdded, pixel);
      }
    });
  }

  findItemToAddMarginLeft(
    bodyItem: BodyItem[],
    itemAdded: BodyItem,
    pixel: string
  ) {
    const style: Style = { prop: 'margin-left', value: `${pixel}px` };
    bodyItem.forEach((item: BodyItem) => {
      if (itemAdded.id === item.id) {
        const styles = item.styles?.filter((x) => x.prop !== style.prop);
        item.styles = styles;
        item.styles?.push(style);
        return;
      }
      if (Array.isArray(item.bodyItem)) {
        return this.findItemToAddMarginLeft(item.bodyItem, itemAdded, pixel);
      }
    });
  }

  findItemToAddMarginRight(
    bodyItem: BodyItem[],
    itemAdded: BodyItem,
    pixel: string
  ) {
    const style: Style = { prop: 'margin-right', value: `${pixel}px` };
    bodyItem.forEach((item: BodyItem) => {
      if (itemAdded.id === item.id) {
        const styles = item.styles?.filter((x) => x.prop !== style.prop);
        item.styles = styles;
        item.styles?.push(style);
        return;
      }
      if (Array.isArray(item.bodyItem)) {
        return this.findItemToAddMarginRight(item.bodyItem, itemAdded, pixel);
      }
    });
  }

  findItemToAddStyle(bodyItem: BodyItem[], itemAdded: BodyItem, style: Style) {
    bodyItem.forEach((item: BodyItem) => {
      if (itemAdded.id === item.id) {
        const styles = item.styles?.filter((x) => x.value !== style.value);
        const elementIndex = item.styles?.findIndex(
          (x) => x.value === style.value
        );
        item.styles = styles;
        if (elementIndex === -1) {
          item.styles?.push(style);
          return;
        }
      }
      if (Array.isArray(item.bodyItem)) {
        return this.findItemToAddStyle(item.bodyItem, itemAdded, style);
      }
    });
  }

  togglePropertiesSidebar() {
    this.patchState((state) => {
      return {
        showPropertiesSidebar: state.showPropertiesSidebar
          ? true
          : !state.showPropertiesSidebar,
      };
    });
  }

  closePropertiesSidebar() {
    this.patchState({
      showPropertiesSidebar: false,
    });
  }

  toggleMenuBar(activeLinkIndex: number) {
    this.patchState({
      activeLinkIndex: activeLinkIndex,
    });
  }

  setActiveItem(activeItem: BodyItem | any) {
    this.patchState({ activeItem: activeItem });
  }

  addColumnItem() {
    this.patchState({ currentId: this.currentId + 1 });
    let addedItem: BodyItem = {
      id: this.currentId,
      name: 'td',
      styles: [
        {
          prop: 'width',
          value: '100%',
        },
        {
          prop: 'display',
          value: 'flex',
        },
        { prop: 'border-collapse', value: 'collapse' },
        { prop: 'display', value: 'flex' },
        { prop: 'flex-direction', value: 'column' },
        { prop: 'padding', value: '0' },
      ],
      content: '',
      bodyItem: [],
    };

    this.findNextItem(this.bodyItem, addedItem);
  }
  addLeftColumnItem() {
    this.patchState({ currentId: this.currentId + 1 });
    let addedItem: BodyItem = {
      id: this.currentId,
      name: 'td',
      styles: [
        {
          prop: 'width',
          value: '100%',
        },
        {
          prop: 'display',
          value: 'flex',
        },
        { prop: 'border-collapse', value: 'collapse' },
        { prop: 'display', value: 'flex' },
        { prop: 'flex-direction', value: 'column' },
        { prop: 'padding', value: '0' },
      ],
      content: '',
      bodyItem: [],
    };

    this.findPreviousItem(this.bodyItem, addedItem);
  }

  findNextItem(bodyItem: BodyItem[], addedItem: any) {
    bodyItem.forEach((item: BodyItem) => {
      if (item.name === 'tr' && Array.isArray(item.bodyItem)) {
        if (this.activeItem.id === item.id) {
          item.bodyItem.push(addedItem);
          this.setActiveItem(addedItem);
          return;
        }
      }
      if (item.name === 'td' && Array.isArray(item.bodyItem)) {
        if (this.activeItem.id === item.id) {
          item.bodyItem.push(addedItem);
          this.setActiveItem(addedItem);
          return;
        }
      }
      if (Array.isArray(item.bodyItem)) {
        return this.findNextItem(item.bodyItem, addedItem);
      }
    });
  }

  findPreviousItem(bodyItem: BodyItem[], addedItem: any) {
    bodyItem.forEach((item: BodyItem) => {
      if (item.name === 'tr' && Array.isArray(item.bodyItem)) {
        item.bodyItem.forEach((element) => {
          if (element.id === this.activeItem.id) {
            const index = item.bodyItem.findIndex(
              (x) => x.id === this.activeItem.id
            );
            let bodyItemTemp = [
              ...item.bodyItem.slice(0, index),
              addedItem,
              ...item.bodyItem.slice(index, item.bodyItem.length + 1),
            ];
            item.bodyItem = bodyItemTemp;
            this.setActiveItem(addedItem);
            return;
          }
        });
      }
      if (item.name === 'tbody' && Array.isArray(item.bodyItem)) {
        item.bodyItem.forEach((element) => {
          if (element.id === this.activeItem.id) {
            const index = item.bodyItem.findIndex(
              (x) => x.id === this.activeItem.id
            );
            let bodyItemTemp = [
              ...item.bodyItem.slice(0, index),
              addedItem,
              ...item.bodyItem.slice(index, item.bodyItem.length + 1),
            ];
            item.bodyItem = bodyItemTemp;
            this.setActiveItem(addedItem);
            return;
          }
        });
      }

      if (Array.isArray(item.bodyItem)) {
        return this.findPreviousItem(item.bodyItem, addedItem);
      }
    });
  }

  addRightColumnItem() {
    this.patchState({ currentId: this.currentId + 1 });
    let addedItem: BodyItem = {
      id: this.currentId,
      name: 'td',
      styles: [
        {
          prop: 'width',
          value: '100%',
        },
        {
          prop: 'display',
          value: 'flex',
        },
        { prop: 'border-collapse', value: 'collapse' },
        { prop: 'display', value: 'flex' },
        { prop: 'flex-direction', value: 'column' },
        { prop: 'padding', value: '0' },
      ],
      content: '',
      bodyItem: [],
    };

    this.findNextItem(this.bodyItem, addedItem);
  }

  addRowItem() {
    this.patchState({ currentId: this.currentId + 3 });
    let addedItem: BodyItem = {
      id: this.currentId - 2,
      name: 'table',
      styles: [
        { prop: 'border-collapse', value: 'collapse' },
        {
          prop: 'width',
          value: '100%',
        },
      ],
      bodyItem: [
        {
          id: this.currentId - 1,
          name: 'tbody',
          bodyItem: [
            {
              id: this.currentId,
              name: 'tr',
              styles: [
                {
                  prop: 'display',
                  value: 'flex',
                },
                { prop: 'border-collapse', value: 'collapse' },

                { prop: 'flex-direction', value: 'row' },
                { prop: 'padding', value: '0' },
              ],
              bodyItem: [],
            },
          ],
        },
      ],
    };
    if (this.activeItem.toString() === '') {
      this.bodyItem.push(addedItem);
      this.setActiveItem({
        id: this.currentId,
        name: 'tr',
        styles: [
          {
            prop: 'display',
            value: 'flex',
          },
          { prop: 'border-collapse', value: 'collapse' },

          { prop: 'flex-direction', value: 'row' },
          { prop: 'padding', value: '0' },
        ],
        bodyItem: [],
      });
    } else {
      this.findNextItem(this.bodyItem, addedItem);
      this.setActiveItem({
        id: this.currentId,
        name: 'tr',
        styles: [
          {
            prop: 'display',
            value: 'flex',
          },
          { prop: 'border-collapse', value: 'collapse' },

          { prop: 'flex-direction', value: 'row' },
          { prop: 'padding', value: '0' },
        ],
        bodyItem: [],
      });
    }
  }
  addBottomRowItem() {
    this.patchState({ currentId: this.currentId + 3 });
    let addedItem: BodyItem = {
      id: this.currentId - 2,
      name: 'table',
      styles: [
        { prop: 'border-collapse', value: 'collapse' },
        {
          prop: 'width',
          value: '100%',
        },
      ],
      bodyItem: [
        {
          id: this.currentId - 1,
          name: 'tbody',
          bodyItem: [
            {
              id: this.currentId,
              name: 'tr',
              styles: [
                {
                  prop: 'display',
                  value: 'flex',
                },
                { prop: 'border-collapse', value: 'collapse' },

                { prop: 'flex-direction', value: 'row' },
                { prop: 'padding', value: '0' },
              ],
              bodyItem: [],
            },
          ],
        },
      ],
    };
    if (this.activeItem.toString() === '') {
      this.bodyItem.push(addedItem);
      this.setActiveItem({
        id: this.currentId,
        name: 'tr',
        styles: [
          {
            prop: 'display',
            value: 'flex',
          },
          { prop: 'border-collapse', value: 'collapse' },

          { prop: 'flex-direction', value: 'row' },
          { prop: 'padding', value: '0' },
        ],
        bodyItem: [],
      });
    } else {
      this.findNextItem(this.bodyItem, addedItem);
      this.setActiveItem({
        id: this.currentId,
        name: 'tr',
        styles: [
          {
            prop: 'display',
            value: 'flex',
          },
          { prop: 'border-collapse', value: 'collapse' },

          { prop: 'flex-direction', value: 'row' },
          { prop: 'padding', value: '0' },
        ],
        bodyItem: [],
      });
    }
  }
  addTopRowItem() {
    this.patchState({ currentId: this.currentId + 3 });
    let addedItem: BodyItem = {
      id: this.currentId - 2,
      name: 'table',
      styles: [
        { prop: 'border-collapse', value: 'collapse' },
        {
          prop: 'width',
          value: '100%',
        },
      ],
      bodyItem: [
        {
          id: this.currentId - 1,
          name: 'tbody',
          bodyItem: [
            {
              id: this.currentId,
              name: 'tr',
              styles: [
                {
                  prop: 'display',
                  value: 'flex',
                },
                { prop: 'border-collapse', value: 'collapse' },

                { prop: 'flex-direction', value: 'row' },
                { prop: 'padding', value: '0' },
              ],
              bodyItem: [],
            },
          ],
        },
      ],
    };
    if (this.activeItem.toString() === '') {
      this.bodyItem.push(addedItem);
      this.setActiveItem({
        id: this.currentId,
        name: 'tr',
        styles: [
          {
            prop: 'display',
            value: 'flex',
          },
          { prop: 'border-collapse', value: 'collapse' },

          { prop: 'flex-direction', value: 'row' },
          { prop: 'padding', value: '0' },
        ],
        bodyItem: [],
      });
    } else {
      this.findPreviousItem(this.bodyItem, addedItem);
      this.setActiveItem({
        id: this.currentId,
        name: 'tr',
        styles: [
          {
            prop: 'display',
            value: 'flex',
          },
          { prop: 'border-collapse', value: 'collapse' },

          { prop: 'flex-direction', value: 'row' },
          { prop: 'padding', value: '0' },
        ],
        bodyItem: [],
      });
    }
  }

  getCurrentId(bodyItem: BodyItem[]) {
    bodyItem.forEach((item: BodyItem) => {
      if (item.id! > this.currentId) {
        this.patchState({ currentId: item.id! + 1 });
      }
      if (Array.isArray(item.bodyItem)) {
        return this.getCurrentId(item.bodyItem);
      }
    });
  }

  convertHtmlToBodyItems(html: string, renderer: Renderer2): BodyItem[] {
    const tempDiv = renderer.createElement('div');
    renderer.setProperty(tempDiv, 'innerHTML', html);
    const bodyItems: BodyItem[] = [];
    Array.from(tempDiv.children).forEach((element: any) => {
      if (element.nodeName.toLowerCase() === 'table') {
        bodyItems.push(
          this.convertElementToBodyItem(element, this.currentId, renderer)
        );
        this.patchState({ currentId: this.currentId + 1 });
      }
    });
    return bodyItems;
  }

  convertElementToBodyItem(
    element: Element,
    id: number,
    renderer: Renderer2
  ): any {
    const bodyItem: BodyItem = {
      id: id,
      name: element.nodeName.toLowerCase(),
      src: '',
      styles: [],
      bodyItem: [],
      attribute: [],
    };

    let width = element.getAttribute('width');
    if (width) {
      bodyItem.attribute?.push({ prop: 'width', value: width });
    }
    let cellpadding = element.getAttribute('cellpadding');
    if (cellpadding) {
      bodyItem.attribute?.push({ prop: 'cellpadding', value: cellpadding });
    }
    let cellspacing = element.getAttribute('cellspacing');
    if (cellspacing) {
      bodyItem.attribute?.push({ prop: 'cellspacing', value: cellspacing });
    }
    let border = element.getAttribute('border');
    if (border) {
      bodyItem.attribute?.push({ prop: 'border', value: border });
    }
    let height = element.getAttribute('height');
    if (height) {
      bodyItem.attribute?.push({ prop: 'height', value: height });
    }
    let align = element.getAttribute('align');
    if (align) {
      bodyItem.attribute?.push({ prop: 'align', value: align });
    }
    let valign = element.getAttribute('valign');
    if (valign) {
      bodyItem.attribute?.push({ prop: 'valign', value: valign });
    }
    let bgcolor = element.getAttribute('bgcolor');
    if (bgcolor) {
      bodyItem.attribute?.push({ prop: 'bgcolor', value: bgcolor });
    }
    let href = element.getAttribute('href');
    if (href) {
      bodyItem.attribute?.push({ prop: 'href', value: href });
    }
    let stylesTemp: string =
      element.getAttribute('style')?.replace(/\s/g, '') || '';
    if (stylesTemp) {
      let styles: Style[] = [];
      let prop = '';
      let value = '';
      while (stylesTemp && stylesTemp !== '' && stylesTemp !== null) {
        const indexProp = stylesTemp.indexOf(':');
        if (indexProp > -1) {
          prop = stylesTemp?.substring(0, indexProp).trim();
          let t1: string = stylesTemp?.substring(indexProp + 1);
          stylesTemp = t1;
          if (
            stylesTemp.indexOf(':') === -1 &&
            stylesTemp.indexOf(';') === -1
          ) {
            value = stylesTemp?.substring(0).trim();
            styles.push({ prop: prop, value: value });
            break;
          }
        } else {
          break;
        }
        const indexValue = stylesTemp.indexOf(';');
        if (indexValue > -1) {
          value = stylesTemp?.substring(0, indexValue).trim();
          let t2: string = stylesTemp?.substring(indexValue + 1);
          stylesTemp = t2;
        } else {
          break;
        }
        if (prop !== '' && value !== '') {
          styles.push({ prop: prop, value: value });
        }
      }
      bodyItem.styles = styles;
    }
    if (element.nodeType === Node.TEXT_NODE) {
      bodyItem.content = element.textContent!.trim();
    }
    Array.from(element.children).forEach((childElement: Element) => {
      this.patchState({ currentId: this.currentId + 1 });
      bodyItem.bodyItem.push(
        this.convertElementToBodyItem(childElement, this.currentId, renderer)
      );
    });
    if (bodyItem.name === 'img') {
      bodyItem.src = element.getAttribute('src')!;
    }
    if (
      bodyItem.name !== 'table' &&
      bodyItem.name !== 'tbody' &&
      bodyItem.name !== 'tr' &&
      bodyItem.name !== 'td' &&
      bodyItem.name !== 'img'
    ) {
      bodyItem.content = element.textContent!.trim();
    }

    if (
      bodyItem.name === 'td' ||
      bodyItem.name === 'span' ||
      bodyItem.name === 'a'
    ) {
      if (
        element.innerHTML.toString().includes(' &amp; ') &&
        element.innerHTML
          .toString()
          .replace(' &amp; ', '&')
          .replace(/\s/g, '') ===
          element.textContent?.toString().replace(/\s/g, '')
      ) {
        bodyItem.content = element.textContent?.toString();
      }
      if (
        element.innerHTML.toString().includes(' &nbsp; ') &&
        element.innerHTML
          .toString()
          .replace(' &nbsp; ', ' ')
          .replace(/\s/g, '') ===
          element.textContent?.toString().replace(/\s/g, '')
      ) {
        bodyItem.content = element.textContent?.toString();
      }

      if (
        bodyItem.name === 'td' &&
        element.innerHTML.toString().replace(/\s/g, '') ===
          element.textContent?.toString().replace(/\s/g, '')
      ) {
        bodyItem.content = element.textContent?.toString();
      } else {
        const contentTd = element.innerHTML.toString().replace(/\s/g, '');
        const lastIndex = contentTd.indexOf('<');
        if (lastIndex >= 0) {
          const content = contentTd.substring(0, lastIndex);
          bodyItem.content = content;
        }
      }
    }
    return bodyItem;
  }

  getCssStyle(item: BodyItem) {
    let result = '';
    if (item.styles) {
      for (let i of item.styles) {
        result = `${result} ${i.prop + ':'} ${i.value}; `;
      }
    }
    return result;
  }

  getAttribute(item: BodyItem, attributeName: string) {
    let result = '';
    if (item.attribute) {
      item.attribute.forEach((element) => {
        if (element.prop === attributeName) {
          result = element.value;
        }
      });
    }
    return result;
  }
}
