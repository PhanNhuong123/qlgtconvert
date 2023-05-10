import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { BodyItem } from 'src/app/model/body-item';
import { Style } from 'src/app/model/style';
import { EmailTemplateBuilderStore } from '../email-template.store';

@Component({
  selector: 'app-properties-sidebar',
  templateUrl: './properties-sidebar.component.html',
  styleUrls: ['./properties-sidebar.component.scss'],
})
export class PropertiesSidebarComponent implements OnInit {
  @Input() itemElement!: BodyItem;
  @Input() showPropertiesSidebar: boolean = false;

  @ViewChild('propertiesSidebar') propertiesSidebar!: ElementRef;
  public itemStyle!: string;
  constructor(private emailTemplateBuilderStore: EmailTemplateBuilderStore) {}

  ngOnInit(): void {}

  getPaddingLeft(): string {
    let result: string = '0';
    if (this.itemElement.styles) {
      this.itemElement.styles?.forEach((element: Style) => {
        if (element.prop === 'padding-left') {
          let index = element.value.indexOf('px');
          result = element.value.substring(0, index);
        }
      });
    }
    return result;
  }

  getPaddingRight(): string {
    let result: string = '0';
    if (this.itemElement.styles) {
      this.itemElement.styles?.forEach((element: Style) => {
        if (element.prop === 'padding-right') {
          let index = element.value.indexOf('px');
          result = element.value.substring(0, index);
        }
      });
    }
    return result;
  }

  getPaddingTop(): string {
    let result: string = '0';
    if (this.itemElement.styles) {
      this.itemElement.styles?.forEach((element: Style) => {
        if (element.prop === 'padding-top') {
          let index = element.value.indexOf('px');
          result = element.value.substring(0, index);
        }
      });
    }
    return result;
  }

  getPaddingBottom(): string {
    let result: string = '0';
    if (this.itemElement.styles) {
      this.itemElement.styles?.forEach((element: Style) => {
        if (element.prop === 'padding-bottom') {
          let index = element.value.indexOf('px');
          result = element.value.substring(0, index);
        }
      });
    }
    return result;
  }

  getMarginLeft(): string {
    let result: string = '0';
    if (this.itemElement.styles) {
      this.itemElement.styles?.forEach((element: Style) => {
        if (element.prop === 'margin-left') {
          let index = element.value.indexOf('px');
          result =
            element.value === 'auto'
              ? 'auto'
              : element.value.substring(0, index);
        }
      });
    }
    return result;
  }

  getMarginRight(): string {
    let result: string = '0';
    if (this.itemElement.styles) {
      this.itemElement.styles?.forEach((element: Style) => {
        if (element.prop === 'margin-right') {
          let index = element.value.indexOf('px');
          result =
            element.value === 'auto'
              ? 'auto'
              : element.value.substring(0, index);
        }
      });
    }
    return result;
  }

  getMarginTop(): string {
    let result: string = '0';
    if (this.itemElement.styles) {
      this.itemElement.styles?.forEach((element: Style) => {
        if (element.prop === 'margin-top') {
          let index = element.value.indexOf('px');
          result = element.value.substring(0, index);
        }
      });
    }
    return result;
  }

  getMarginBottom(): string {
    let result: string = '0';
    if (this.itemElement.styles) {
      this.itemElement.styles?.forEach((element: Style) => {
        if (element.prop === 'margin-bottom') {
          let index = element.value.indexOf('px');
          result = element.value.substring(0, index);
        }
      });
    }
    return result;
  }

  getWidth(): string {
    let result: string = '0';
    if (this.itemElement.styles) {
      this.itemElement.styles?.forEach((element: Style) => {
        if (element.prop === 'width') {
          result = element.value;
        }
      });
    }
    return result;
  }

  checkArray(array: Style[], values: Style[]) {
    return values.every((value: Style) => {
      return array.some((element: Style) => {
        return element.prop === value.prop && element.value === value.value;
      });
    });
  }

  getCenterAlign(): boolean {
    return this.checkArray(this.itemElement.styles!, [
      { prop: 'display', value: 'flex' },
      { prop: 'justify-content', value: 'center' },
      { prop: 'margin-left', value: 'auto' },
      { prop: 'margin-right', value: 'auto' },
    ]);
  }

  getLeftAlign(): boolean {
    return this.checkArray(this.itemElement.styles!, [
      { prop: 'display', value: 'flex' },
      { prop: 'justify-content', value: 'center' },
      { prop: 'margin-right', value: 'auto' },
    ]);
  }

  getRightAlign(): boolean {
    return this.checkArray(this.itemElement.styles!, [
      { prop: 'display', value: 'flex' },
      { prop: 'justify-content', value: 'center' },
      { prop: 'margin-left', value: 'auto' },
    ]);
  }

  getHeight(): string {
    let result: string = '0';
    if (this.itemElement.styles) {
      this.itemElement.styles?.forEach((element: Style) => {
        if (element.prop === 'height') {
          result = element.value;
        }
      });
    }
    return result;
  }

  addWidthStyle(event: any) {
    let width = event.target.value;
    this.emailTemplateBuilderStore.addWidthStyle(this.itemElement, width);
  }

  addHeightStyle(event: any) {
    let height = event.target.value;
    this.emailTemplateBuilderStore.addHeightStyle(this.itemElement, height);
  }

  addItemStyle() {
    const style: Style = { prop: '', value: this.itemStyle };
    this.emailTemplateBuilderStore.addItemStyle(this.itemElement, style);
  }

  addAlignCenterStyle() {
    this.emailTemplateBuilderStore.addAlignCenterStyle(this.itemElement);
  }

  addAlignLeftStyle() {
    this.emailTemplateBuilderStore.addAlignLeftStyle(this.itemElement);
  }

  addAlignRightStyle() {
    this.emailTemplateBuilderStore.addAlignRightStyle(this.itemElement);
  }

  addChangeContent(event: any) {
    let content = event.target.value;
    this.emailTemplateBuilderStore.addChangeContent(this.itemElement, content);
  }

  addFontBoldStyle() {
    this.emailTemplateBuilderStore.addFontBoldStyle(this.itemElement);
  }

  addFontItalicStyle() {
    this.emailTemplateBuilderStore.addFontItalicStyle(this.itemElement);
  }

  addFontUnderlineStyle() {
    this.emailTemplateBuilderStore.addFontUnderlineStyle(this.itemElement);
  }

  addPaddingTopBottomStyle(event: any) {
    let pixel = event.target.value;
    this.emailTemplateBuilderStore.addPaddingTopBottomStyle(
      this.itemElement,
      pixel
    );
  }

  addPaddingLeftRightStyle(event: any) {
    let pixel = event.target.value;
    this.emailTemplateBuilderStore.addPaddingLeftRightStyle(
      this.itemElement,
      pixel
    );
  }

  addMarginTopBottomStyle(event: any) {
    let pixel = event.target.value;
    this.emailTemplateBuilderStore.addMarginTopBottomStyle(
      this.itemElement,
      pixel
    );
  }

  addMarginLeftRightStyle(event: any) {
    let pixel = event.target.value;
    this.emailTemplateBuilderStore.addMarginLeftRightStyle(
      this.itemElement,
      pixel
    );
  }

  closePropertiesSidebar() {
    this.emailTemplateBuilderStore.closePropertiesSidebar();
  }
}
