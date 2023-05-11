import { Component, Renderer2, ViewEncapsulation, OnInit } from '@angular/core';
import { EmailTemplateBuilderStore } from './email-template.store';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { EmailContentStore } from '../email-content/email-content.store';

@Component({
  selector: 'app-email-template-builder',
  templateUrl: './email-template-builder.component.html',
  styleUrls: ['./email-template-builder.component.scss'],
})
export class EmailTemplateBuilderComponent implements OnInit {
  preview: boolean = false;
  vm$ = this.emailTemplateBuilderStore.select((state) => {
    return {
      bodyItem: state.bodyItem,
      activeLinkIndex: state.activeLinkIndex,
      showLoading: state.showLoading,
      activeItem: state.activeItem,
      showPropertiesSidebar: state.showPropertiesSidebar,
      htmlTemplate: state.htmlTemplate,
      showAddNewElementModal: state.showAddNewElementModal,
    };
  });

  constructor(
    private emailTemplateBuilderStore: EmailTemplateBuilderStore,
    private sanitizer: DomSanitizer,
    private renderer: Renderer2,
    private emailContentStore: EmailContentStore
  ) {}

  ngOnInit(): void {
    this.generateTemplateByHTMLString(this.emailContentStore.htmlContent);
  }

  saveTemplate() {
    this.emailTemplateBuilderStore.saveTemplate();
  }

  exportFile() {
    this.emailTemplateBuilderStore.exportFile();
  }

  testTemplate!: string;
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      this.testTemplate = reader.result!.toString();

      this.emailTemplateBuilderStore.patchState({
        bodyItem: this.emailTemplateBuilderStore.convertHtmlToBodyItems(
          this.testTemplate,
          this.renderer
        ),
      });
    };
    reader.readAsText(file);
  }

  toggleAddNewElementModal(event: MouseEvent) {
    const container = event.target as HTMLElement;
    if (container && !container.closest('#item')) {
      this.emailTemplateBuilderStore.toggleAddNewElementModal();
    }
  }

  togglePreview() {
    this.emailTemplateBuilderStore.getHtmlTemplate();
    this.preview = !this.preview;
  }

  getSafeHtml(htmlString: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(htmlString);
  }

  toggleMenuBar(activeLinkIndex: number) {
    this.emailTemplateBuilderStore.toggleMenuBar(activeLinkIndex);
  }

  addRowItem() {
    this.emailTemplateBuilderStore.addRowItem();
  }

  addColumnItem() {
    this.emailTemplateBuilderStore.addColumnItem();
  }

  addButton() {
    this.emailTemplateBuilderStore.addButton();
  }

  addText() {
    this.emailTemplateBuilderStore.addText();
  }

  addImage() {
    this.emailTemplateBuilderStore.addImage();
  }

  generateTemplateByHTMLString(value: string) {
    this.emailTemplateBuilderStore.patchState({
      bodyItem: this.emailTemplateBuilderStore.convertHtmlToBodyItems(
        value,
        this.renderer
      ),
    });
  }
}
