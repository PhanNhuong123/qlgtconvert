import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DropInfo } from './../../../model/drop-info';
import { Component, HostBinding, Inject, ViewEncapsulation } from '@angular/core';
import { EmailTemplateBuilderStore } from '../email-template.store';
import { BodyItem } from 'src/app/model/body-item';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ContentComponent {

  @HostBinding('class')
  get hostClasses(): string {
    return "w-full";
  }

  constructor(
    private emailTemplateBuilderStore: EmailTemplateBuilderStore,
    private sanitizer: DomSanitizer,
    @Inject(DOCUMENT) private document: any
  ) {
    this.prepareDragDrop(this.nodes);
  }

  vm$ = this.emailTemplateBuilderStore.select((state) => {
    return {
      bodyItem: state.bodyItem,
      activeItem: state.activeItem,
    };
  });

  ngOnInit(): void {
  }

  onContainerClick(event: MouseEvent): void {
    const container = event.target as HTMLElement;
    if (container && !container.closest('#item')) {
      this.emailTemplateBuilderStore.setActiveItem('');
      this.emailTemplateBuilderStore.closePropertiesSidebar();
    }
  }

  setActiveItem(activeItem: any, event: MouseEvent): void {
    event.stopPropagation();
    this.emailTemplateBuilderStore.setActiveItem(activeItem);
    this.emailTemplateBuilderStore.togglePropertiesSidebar();
  }

  toggleAddNewElementModal(): void {
    this.emailTemplateBuilderStore.toggleAddNewElementModal();
  }

  addButton(): void {
    this.emailTemplateBuilderStore.addButton();
  }

  addText(): void {
    this.emailTemplateBuilderStore.addText();
  }

  addImage(): void {
    this.emailTemplateBuilderStore.addImage();
  }

  addColumnItem(): void {
    this.emailTemplateBuilderStore.addColumnItem();
  }

  addRowItem(): void {
    this.emailTemplateBuilderStore.addRowItem();
  }

  getCssStyle(item: BodyItem) {
    // let result = '';
    // if (item.styles) {
    //   for (let i of item.styles) {
    //     result = `${result} ${i.prop + ':'} ${i.value}; `;
    //   }
    // }
    // return result;
    return this.emailTemplateBuilderStore.getCssStyle(item);
  }

  getAttribute(item: BodyItem, attributeName: string) {
    // let result = '';

    // if (item.attribute) {
    //   item.attribute.forEach((element) => {
    //     if (element.prop === attributeName) {
    //       result = element.value;
    //     }
    //     if (item.name === 'img') {
    //       console.log('attributeName :', attributeName);
    //       console.log('element.value :', element.value);
    //     }
    //   });
    // }

    // return result;
    return this.emailTemplateBuilderStore.getAttribute(item,attributeName);
  }

  getSafeHtml(item: BodyItem): SafeHtml {
    if (
      item.name === 'table' ||
      item.name === 'tbody' ||
      item.name === 'tr' ||
      item.name === 'td'
    ) {
      return '';
    }
    let htmlString = `${item.content}`;
    if (item.name === 'img') {
      htmlString = `<img src='${item.src}'`;
      if (item.styles) {
        htmlString += ` style="`;
        item.styles?.forEach((style) => {
          htmlString += `${style.prop}: ${style.value};`;
        });
      }
      htmlString += `" />`;
    }
    if (item.name === 'button') {
      htmlString = `<button`;
      if (item.styles) {
        htmlString += ` style="`;
        item.styles?.forEach((style) => {
          htmlString += `${style.prop}: ${style.value};`;
        });
      }

      htmlString += `">${item.content}</button>`;
    }
    if (item.name === 'a') {
      htmlString = `<div`;
      if (item.styles) {
        htmlString += ` style="`;
        item.styles?.forEach((style) => {
          htmlString += `${style.prop}: ${style.value};`;
        });
      }

      htmlString += `">${item.content}</div>`;
    }
    if (item.name === 'span') {
      htmlString = `<span`;
      if (item.styles) {
        htmlString += ` style="`;
        item.styles?.forEach((style) => {
          htmlString += `${style.prop}: ${style.value};`;
        });
      }

      htmlString += `">${item.content}</span>`;
    }
    if (item.name === 'em') {
      htmlString = `<em`;
      if (item.styles) {
        htmlString += ` style="`;
        item.styles?.forEach((style) => {
          htmlString += `${style.prop}: ${style.value};`;
        });
      }

      htmlString += `">${item.content}</em>`;
    }

    return this.sanitizer.bypassSecurityTrustHtml(htmlString);
  }

  nodes: BodyItem[] = [
    {
      id: 1,
      name: 'tr',
      styles: [
        {
          prop: 'width',
          value: '100%',
        },
        {
          prop: 'height',
          value: '100%',
        },
        {
          prop: 'display',
          value: 'flex',
        },
      ],
      bodyItem: [
        {
          id: 2,
          name: 'td',
          styles: [
            {
              prop: 'width',
              value: '100%',
            },
            {
              prop: 'height',
              value: '100%',
            },
            {
              prop: 'display',
              value: 'flex',
            },
            { prop: 'display', value: 'flex' },
            { prop: 'flex-direction', value: 'column' },
          ],
          bodyItem: [
            {
              id: 3,
              name: 'img',
              src: 'https://via.placeholder.com/576x282.png?text=Example Image',
              styles: [
                {
                  prop: 'width',
                  value: '100%',
                },
                {
                  prop: 'height',
                  value: '100%',
                },
              ],
              bodyItem: [],
            },
          ],
        },
      ],
    },
    {
      id: 4,
      name: 'tr',
      styles: [
        {
          prop: 'width',
          value: '100%',
        },
        {
          prop: 'height',
          value: '100%',
        },
        {
          prop: 'display',
          value: 'flex',
        },
      ],
      bodyItem: [
        {
          id: 5,
          name: 'td',
          styles: [
            {
              prop: 'width',
              value: '100%',
            },
            { prop: 'display', value: 'flex' },
            { prop: 'flex-direction', value: 'column' },
          ],
          bodyItem: [
            {
              id: 6,
              name: 'button',
              content: 'Exaple Button',
              styles: [
                {
                  prop: 'background-color',
                  value: 'gray',
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
                  prop: 'margin-top',
                  value: '10px',
                },
                {
                  prop: 'margin-bottom',
                  value: '0px',
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
                  prop: 'padding-top',
                  value: '5px',
                },
                {
                  prop: 'padding-bottom',
                  value: '5px',
                },
              ],
              bodyItem: [],
            },
          ],
        },
        {
          id: 7,
          name: 'td',
          styles: [
            {
              prop: 'width',
              value: '100%',
            },
            { prop: 'display', value: 'flex' },
            { prop: 'flex-direction', value: 'column' },
          ],
          content: '',
          bodyItem: [
            {
              id: 8,
              name: 'a',
              styles: [
                {
                  prop: 'font-weight',
                  value: 'bold',
                },
                {
                  prop: 'display',
                  value: 'flex',
                },
                {
                  prop: 'justify-content',
                  value: 'center',
                },
                {
                  prop: 'margin-left',
                  value: 'auto',
                },
                {
                  prop: 'margin-right',
                  value: 'auto',
                },
                {
                  prop: 'padding-top',
                  value: '10px',
                },
                {
                  prop: 'padding-bottom',
                  value: '0px',
                },
              ],
              content: 'Lorem Ipsum',
              bodyItem: [],
            },
            {
              id: 9,
              name: 'a',
              styles: [
                {
                  prop: 'font-weight',
                  value: 'bold',
                },
                {
                  prop: 'display',
                  value: 'flex',
                },
                {
                  prop: 'justify-content',
                  value: 'center',
                },
                {
                  prop: 'margin-left',
                  value: 'auto',
                },
                {
                  prop: 'margin-right',
                  value: 'auto',
                },
                {
                  prop: 'padding-top',
                  value: '10px',
                },
                {
                  prop: 'padding-bottom',
                  value: '0px',
                },
              ],
              content: 'Lorem Ipsum',
              bodyItem: [],
            },
          ],
        },
      ],
    },
  ];
  dropTargetIds: string[] = [];
  nodeLookup: any = {};
  dropActionTodo!: DropInfo;

  prepareDragDrop(nodes: BodyItem[]) {
    nodes.forEach((node: BodyItem) => {
      this.dropTargetIds.push(node.id!.toString());
      this.nodeLookup[node.id!] = node;
      this.prepareDragDrop(node.bodyItem);
    });
  }

  dragMoved(event: any) {
    console.log('dragMoved :');
    let e = this.document.elementFromPoint(
      event.pointerPosition.x,
      event.pointerPosition.y
    );

    if (!e) {
      this.clearDragInfo();
      return;
    }
    let container = e.classList.contains('node-item')
      ? e
      : e.closest('.node-item');
    if (!container) {
      this.clearDragInfo();
      return;
    }
    this.dropActionTodo = {
      targetId: container.getAttribute('data-id'),
    };
    const targetRect = container.getBoundingClientRect();
    const oneThird = targetRect.height / 3;

    if (event.pointerPosition.y - targetRect.top < oneThird) {
      // before
      this.dropActionTodo['action'] = 'before';
    } else if (event.pointerPosition.y - targetRect.top > 2 * oneThird) {
      // after
      this.dropActionTodo['action'] = 'after';
    } else {
      // inside
      this.dropActionTodo['action'] = 'inside';
    }
    this.showDragInfo();
  }

  drop(event: any) {
    console.log('drop :');
    if (!this.dropActionTodo) return;

    const draggedItemId = event.item.data;
    const parentItemId = event.previousContainer.id;
    const targetListId = this.getParentNodeId(
      this.dropActionTodo.targetId,
      this.nodes,
      'main'
    );

    console.log(
      '\nmoving\n[' + draggedItemId + '] from list [' + parentItemId + ']',
      '\n[' +
        this.dropActionTodo.action +
        ']\n[' +
        this.dropActionTodo.targetId +
        '] from list [' +
        targetListId +
        ']'
    );

    const draggedItem = this.nodeLookup[draggedItemId];

    const oldItemContainer =
      parentItemId != 'main'
        ? this.nodeLookup[parentItemId].bodyItem
        : this.nodes;
    const newContainer =
      targetListId != 'main'
        ? this.nodeLookup[targetListId].bodyItem
        : this.nodes;

    let i = oldItemContainer.findIndex((c: any) => c.id === draggedItemId);
    oldItemContainer.splice(i, 1);

    switch (this.dropActionTodo.action) {
      case 'before':
      case 'after':
        const targetIndex = newContainer.findIndex(
          (c: any) => c.id === this.dropActionTodo.targetId
        );
        if (this.dropActionTodo.action == 'before') {
          newContainer.splice(targetIndex, 0, draggedItem);
        } else {
          newContainer.splice(targetIndex + 1, 0, draggedItem);
        }
        break;

      case 'inside':
        this.nodeLookup[this.dropActionTodo.targetId].bodyItem.push(
          draggedItem
        );
        this.nodeLookup[this.dropActionTodo.targetId].isExpanded = true;
        break;
    }

    this.clearDragInfo(true);
  }
  getParentNodeId(
    id: string,
    nodesToSearch: BodyItem[],
    parentId: string
  ): string {
    console.log('getParentNodeId :');
    for (let node of nodesToSearch) {
      if (node.id!.toString() == id) return parentId;
      let ret = this.getParentNodeId(id, node.bodyItem!, node.id!.toString());
      if (ret) return ret;
    }
    return '';
  }
  showDragInfo(): void {
    console.log('showDragInfo :');
    this.clearDragInfo();
    if (this.dropActionTodo) {
      this.document
        .getElementById('node-' + this.dropActionTodo.targetId)
        .classList.add('drop-' + this.dropActionTodo.action);
    }
  }
  clearDragInfo(dropped = false): void {
    console.log(' clearDragInfo :');
    if (dropped) {
      this.dropActionTodo.action = '';
      this.dropActionTodo.targetId = '';
    }
    this.document
      .querySelectorAll('.drop-before')
      .forEach((element: any) => element.classList.remove('drop-before'));
    this.document
      .querySelectorAll('.drop-after')
      .forEach((element: any) => element.classList.remove('drop-after'));
    this.document
      .querySelectorAll('.drop-inside')
      .forEach((element: any) => element.classList.remove('drop-inside'));
  }
}
