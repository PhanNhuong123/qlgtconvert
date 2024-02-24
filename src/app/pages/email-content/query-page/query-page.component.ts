import { EmailContentStore } from './../email-content.store';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EFeatureQuery, EProperty, ETab, IProperty, ITabProperty, ITemplate } from 'src/app/app.constant';


@Component({
  selector: 'app-query-page',
  templateUrl: './query-page.component.html',
  styleUrls: ['./query-page.component.scss'],
})
export class QueryPageComponent implements OnInit {
  constructor(private emailContentStore: EmailContentStore, private router: Router) { }

  ngOnInit(): void {
    this.content = this.createContentFile(this.emailContentStore.currentTab.type);
  }

  public listQuerySelect = new Set<number>();
  public content: string = "";

  EProperty = EProperty;
  EFeatureQuery = EFeatureQuery;

  vm$ = this.emailContentStore.select(state => {
    return {
      queryShow: state.queryShow,
      isProcess: state.isProcess,
      editQuery: state.editQuery,
      isQueryInsert: state.isQueryInsert,
      isEditingRawFile: state.isEditingRawFile,
      isSelectQuery: state.isSelectQuery,
      searchValue: state.searchValue,
      searchResult: state.searchResult,
      listQuerySelect: state.listQuerySelect,
      properties: state.properties,
      currentTab: state.currentTab
    }
  });



  get listOption(): ITemplate[] {
    if (this.emailContentStore.searchResult.length > 0) {
      return this.emailContentStore.searchResult;
    }
    return this.emailContentStore.listOptionQuery;
  }
  public back(): void {
    this.emailContentStore.updateIsProcess(false);
    this.emailContentStore.updateEditQuery(false);
    this.router.navigateByUrl("");
  }
  public copyQuery(): void {
    navigator.clipboard.writeText(this.content);
    alert('copied !!');
  }

  public updateCurrentTab(prop: ITabProperty): void {
    this.emailContentStore.updateCurrentTab(prop);
    this.content = this.createContentFile(prop.type);
  }

  public createContentFile(type: ETab): string {
    let result = "";
    switch (type) {
      case ETab.ENTITY:
        result = this.createEntityContent();
        break;

      case ETab.DTO:
        result = this.createDtoContent();
        break;

      case ETab.I_APP_SERVICE:
        result = this.createIAppServiceContent();
        break;

      case ETab.APP_SERVICE:
        result = this.createAppServiceContent();
        break;

      case ETab.DANH_SACH_CS:
        result = this.createDanhSachCSContent();
        break;

      case ETab.DANH_SACH_RAZOR:
        result = this.createDanhSachRazorContent();
        break;

      case ETab.FORM_DIALOG_CS:
        result = this.createFormDialogCsContent();
        break;

      case ETab.FORM_DIALOG_RAZOR:
        result = this.createFormDialogRazorContent();
        break;

      case ETab.SEARCH_CS:
        result = this.createSearchCsContent();
        break;

      case ETab.SEARCH_RAZOR:
        result = this.createSearchRazorContent();
        break;
    }

    return result
  }

  private convertSearchRazorAdvanceSearch() {
    let result = "";
    let model = this.emailContentStore.model;

    model.forEach((m) => {
      result += `<MudItem md="6">
      <MudTextField Label="${m.label}"
                    Variant="Variant.Outlined"
                    Margin="Margin.Dense"
                    @bind-Value="SearchModel.${m.propertyName}" />
  </MudItem>\r\n`
    })
    return result;
  }

  public createSearchRazorContent(): string {
    let result: string = `<MudExpansionPanel Text="Lọc dữ liệu" Style="font-weight: bold; padding: 0;border-radius: 6px;">
    <MudTabs Elevation="2" Rounded="true" ApplyEffectsToContainer="true">
        <MudTabPanel Text="Tìm kiếm">
            <MudGrid Spacing="3" Class="pa-4 pt-7">
                <MudItem md="12">
                    <MudTextField ShrinkLabel Label="Tìm kiếm"
                                  Variant="Variant.Outlined"
                                  Margin="Margin.Dense"
                                  @bind-Value="BasicSearch" />
                </MudItem>
            </MudGrid>
            <div class="search-container">
                <MudButton Size="Size.Small"
                           Variant="Variant.Filled"
                           StartIcon="@Icons.Material.Filled.Search"
                           IconSize="Size.Large"
                           Color="Color.Primary"
                           Style="height: 36px;font-size: 14px;"
                           OnClick="BasicSearchClick">
                    Tìm kiếm
                </MudButton>
            </div>
        </MudTabPanel>
        <MudTabPanel Text="Tìm kiếm nâng cao">
            <MudGrid Spacing="3" Class="pa-4 pt-7">
                ${this.convertSearchRazorAdvanceSearch()}
            </MudGrid>
            <div class="search-container">
                <MudButton Size="Size.Small"
                           Variant="Variant.Filled"
                           StartIcon="@Icons.Material.Filled.Search"
                           IconSize="Size.Large"
                           Color="Color.Primary"
                           Style="height: 36px;font-size: 14px;"
                           OnClick="AdvanceSearchClick">
                    Tìm kiếm
                </MudButton>
            </div>
        </MudTabPanel>
    </MudTabs>
</MudExpansionPanel>
  `;
    return result;
  }

  public createSearchCsContent(): string {
    let name = this.emailContentStore.moduleInfo.tableName;
    let nameSpace = this.emailContentStore.moduleInfo.nameSpace
    let result: string = `using System.Threading.Tasks;
    using Microsoft.AspNetCore.Components;
    using MudBlazor;
    using SMS.DuLieuGTVTService.Models;

    namespace SMS.Blazor.Pages.Admin.${nameSpace};

    public partial class Search
    {
        [Parameter, EditorRequired] public EventCallback<string?> BasicSearchOnClick { get; set; }
        [Parameter, EditorRequired] public EventCallback<Tbl${name}Dto> AdvanceSearchOnClick { get; set; }
        [Inject] ISnackbar Snackbar { get; set; } = null!;
        public string? BasicSearch { get; set; }
        public Tbl${name}Dto SearchModel { get; set; } = new Tbl${name}Dto();

        private async Task BasicSearchClick()
        {
            try
            {
                await BasicSearchOnClick.InvokeAsync(BasicSearch);
            }
            catch (System.Exception ex)
            {
                Snackbar.Add("Lỗi: " + ex.Message, Severity.Error);
            }
        }

        private async Task AdvanceSearchClick()
        {
            try
            {
                await AdvanceSearchOnClick.InvokeAsync(SearchModel);
            }
            catch (System.Exception ex)
            {
                Snackbar.Add("Lỗi: " + ex.Message, Severity.Error);
            }
        }
    }
  `;
    return result;
  }

  private convertFormDialogRazorMubItem() {
    let result = "";
    let model = this.emailContentStore.model;

    model.forEach((m) => {
      result += `<MudItem md="6" xs="6">
      <MudTextField Label="${m.label}" Required="${m.isRequired ? "true" : "false"}"
                    Variant="Variant.Outlined"
                    Margin="Margin.Dense"
                    ReadOnly="ShowDetail"
                    @bind-Value="Model.${m.propertyName}" For="@(() => Model.${m.propertyName})" />
  </MudItem>\r\n`
    })
    return result;
  }

  public createFormDialogRazorContent(): string {
    let name = this.emailContentStore.moduleInfo.tableName;
    let nameSpace = this.emailContentStore.moduleInfo.nameSpace;
    let nameSpaceArr = nameSpace.split('.');
    nameSpaceArr.shift();
    let ModuleContentType = nameSpaceArr.join('.');

    let result: string = `<style>
    .mud-dialog {
        background-color: #EFF1F6 !important;
        border: 1px solid #C4C4C6 !important;
        border-radius: 2px !important;
    }

        .mud-dialog .mud-dialog-title {
            padding: 47px 24px 24px 24px !important;
        }

            .mud-dialog .mud-dialog-title .mud-typography {
                font-size: 30px !important;
                font-weight: 600 !important;
                line-height: 38px !important;
                color: #1D2939 !important;
            }

    .mud-tabs {
        background-color: white !important;
    }

    .mud-tabs-panels {
        height: 400px !important;
        overflow: auto;
    }

    .mud-dialog .mud-dialog-actions {
        padding: 18px 24px 24px 24px !important;
    }

    .file-chip {
        background-color: white !important;
        color: #1D2939 !important;
        height: 36px !important;
        min-width: 42px;
        font-size: 16px !important;
        border: 1px solid #D0D5DD !important;
        margin-left: 40px !important;
        border-radius: 20px !important;
    }

    .chip-filename:hover {
        cursor: pointer;
    }

    .close-button {
        margin-left: 8px !important;
        border-color: #D0D5DD !important;
        background-color: white !important;
        color: #344054 !important;
    }

    .file-container .mud-icon-button {
        padding: 6px !important;
    }

    .action-button {
        height: 36px !important;
        min-width: 90px !important;
    }

        .action-button .mud-button-label {
            font-weight: 500 !important;
            font-size: 14px !important;
            line-height: 20px !important;
        }
</style>

<MudDialog>
    <DialogContent>
        <MudTabs Elevation="2" Rounded="true" ApplyEffectsToContainer="true" PanelClass="pa-6">
            <MudTabPanel Text="Thông tin chung">
                <MudForm @ref="form" @bind-IsValid="@success" @bind-Errors="@errors">
                    <MudGrid Spacing="3">
                        ${this.convertFormDialogRazorMubItem()}
                    </MudGrid>
                </MudForm>
            </MudTabPanel>
            <MudTabPanel Text="Tập tin" Class="file-container">
                <MudFileUpload T="IReadOnlyList<IBrowserFile>" FilesChanged="AddFiles" Class="pb-3" Disabled="@(ShowDetail)">
                    <ButtonTemplate>
                        <MudButton HtmlTag="label"
                                   Variant="Variant.Filled"
                                   Color="MudBlazor.Color.Primary"
                                   StartIcon="@UploadIcon"
                                   for="@context">
                            Tải các tập tin
                        </MudButton>
                    </ButtonTemplate>
                </MudFileUpload>
                @foreach (var file in AddedFiles)
                {
                    <div class="d-flex align-center">
                        <MudIconButton Icon="@Icons.Material.Filled.Download" Color="MudBlazor.Color.Success" OnClick="() => DownloadFile(file, true)" />
                        <MudIconButton Icon="@DeleteIcon" OnClick="() => RemoveFile(file, true)" />
                        <MudChip Variant="Variant.Text" Class="file-chip">
                            <ChildContent>
                                <MudText Class="chip-filename" onclick="@(() => ViewFile(file, true))">@file.FileName</MudText>
                            </ChildContent>
                        </MudChip>
                    </div>
                }
                @foreach (var file in Files)
                {
                    <div class="d-flex align-center">
                        <MudIconButton Icon="@Icons.Material.Filled.Download" Color="MudBlazor.Color.Success" OnClick="() => DownloadFile(file)" />
                        <MudIconButton Icon="@DeleteIcon" OnClick="() => RemoveFile(file)" Disabled="@(ShowDetail)" />
                        <MudChip Variant="Variant.Text" Class="file-chip">
                            <ChildContent>
                                <MudText Class="chip-filename" onclick="@(() => ViewFile(file))">@file.FileName</MudText>
                            </ChildContent>
                        </MudChip>
                    </div>
                }
            </MudTabPanel>
        </MudTabs>
    </DialogContent>
    <DialogActions>
        @if (!ShowDetail)
        {
            <MudButton Size="Size.Small"
                       Class="action-button"
                       Color="Color.Primary"
                       Variant="Variant.Filled"
                       StartIcon="@Icons.Material.Filled.Check"
                       OnClick="() => SubmitAsync()">Lưu</MudButton>
            @if (Model.Id == 0)
            {
                <MudButton Size="Size.Small"
                           Class="action-button"
                           Color="Color.Primary"
                           Variant="Variant.Filled"
                           StartIcon="@Icons.Material.Filled.Check"
                           OnClick="SubmitAndStayAsync">Lưu và Khởi tạo lại</MudButton>
            }
        }
        <MudButton Size="Size.Small"
                   Variant="Variant.Outlined"
                   StartIcon="@Icons.Material.Filled.Close"
                   Class="action-button close-button"
                   OnClick="Cancel">Đóng</MudButton>
    </DialogActions>
</MudDialog>

  `;
    return result;
  }

  public createFormDialogCsContent(): string {
    let name = this.emailContentStore.moduleInfo.tableName;
    let nameSpace = this.emailContentStore.moduleInfo.nameSpace;
    let nameSpaceArr = nameSpace.split('.');
    nameSpaceArr.shift();
    let ModuleContentType = nameSpaceArr.join('.');

    let result: string = `using Microsoft.AspNetCore.Components;
    using Microsoft.AspNetCore.Components.Forms;
    using Microsoft.JSInterop;
    using MudBlazor;
    using Newtonsoft.Json;
    using SMS.Blazor.Models;
    using SMS.Blazor.Pages.Components;
    using SMS.Blazor.Services;
    using SMS.Domain.Shared;
    using SMS.Domain.Shared.Models;
    using SMS.DuLieuGTVTService.Models;
    using SMS.DuLieuGTVTService.Services;
    using SMS.FileManagerService.Models;
    using SMS.FileManagerService.Services;
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Threading.Tasks;
    using Volo.Abp.Content;

    namespace SMS.Blazor.Pages.Admin.${nameSpace};

    public partial class FormDialog
    {
        private const string ModuleContentType = SmsConstants.FileContentModuleType.${ModuleContentType};

        [CascadingParameter] MudDialogInstance MudDialog { get; set; } = null!;
        [Inject] I${name}AppService AppService { get; set; } = null!;
        [Inject] IDialogService DialogService { get; set; } = null!;
        [Inject] IFileContentDataAppService FileService { get; set; } = null!;
        [Inject] IJSRuntime JSRuntime { get; set; } = null!;
        [Inject] ISnackbar Snackbar { get; set; } = null!;
        [Inject] UIGlobalService UIGlobalService { get; set; } = null!;

        [Parameter, EditorRequired] public Tbl${name}Dto Model { get; set; } = new Tbl${name}Dto();
        [Parameter] public bool ShowDetail { get; set; }
        [Parameter, EditorRequired] public EventCallback FormEventCallback { get; set; }

        bool success;
        string[] errors = { };

        IList<FileModel> Files { get; set; } = new List<FileModel>();
        IList<FileModel> RemoveFiles { get; set; } = new List<FileModel>();
        IList<FileModel> AddedFiles { get; set; } = new List<FileModel>();

        MudForm form;

        private string DeleteIcon = @"<svg width=""18"" height=""24"" viewBox=""0 0 18 18"" fill=""none"" xmlns=""http://www.w3.org/2000/svg"">
    <path d=""M2.525 18C2.125 18 1.775 17.85 1.475 17.55C1.175 17.25 1.025 16.9 1.025 16.5V2.25H0V0.75H4.7V0H11.3V0.75H16V2.25H14.975V16.5C14.975 16.9 14.825 17.25 14.525 17.55C14.225 17.85 13.875 18 13.475 18H2.525ZM13.475 2.25H2.525V16.5H13.475V2.25ZM5.175 14.35H6.675V4.375H5.175V14.35ZM9.325 14.35H10.825V4.375H9.325V14.35ZM2.525 2.25V16.5V2.25Z"" fill=""#FF8A00""/>
    </svg>
    ";

        private string UploadIcon = @"<svg width=""18"" height=""24"" viewBox=""0 0 18 18"" fill=""none"" xmlns=""http://www.w3.org/2000/svg"">
    <path d=""M10.125 0C7.4025 0 5.0175 1.935 4.5 4.5C2.025 4.5 0 6.525 0 9C0 9.8325 0.2475 10.5975 0.63 11.25H5.625L10.125 6.75L14.625 11.25H17.7975C17.9325 10.89 18 10.53 18 10.125C18 8.6625 17.055 7.2225 15.75 6.75V5.625C15.75 2.52 13.23 0 10.125 0ZM10.125 10.125L4.5 15.75H9V16.875C9 17.1734 9.11853 17.4595 9.3295 17.6705C9.54048 17.8815 9.82663 18 10.125 18C10.4234 18 10.7095 17.8815 10.9205 17.6705C11.1315 17.4595 11.25 17.1734 11.25 16.875V15.75H15.75L10.125 10.125Z"" fill=""#EDEDED""/>
    </svg>";

        protected override async Task OnInitializedAsync()
        {
            await LoadFiles();
        }

        private async Task LoadFiles()
        {
            if (Model.Id == 0)
                return;

            UIGlobalService.ShowLoading();

            try
            {
                var result = await FileService.GetListAsync(
                new ExtendPagedAndSortedResultRequestDto
                {
                    MaxResultCount = 1000,
                    JsonFilterObject = JsonConvert.SerializeObject(new FileContentDataDto { Type = ModuleContentType, RelatedId = Model.Id })
                });

                if (result != null)
                    Files = result.Items.Select(x => new FileModel { Id = x.Id, FileName = x.Name }).ToList();
            }
            catch (Exception ex)
            {
                Snackbar.Add(
                      "Lỗi: " + ex.Message,
                      Severity.Error,
                      config => { config.ShowCloseIcon = false; });
            }

            UIGlobalService.HideLoading();
        }

        private void AddFiles(IReadOnlyList<IBrowserFile> files)
        {
            var duplicateFileNames = new List<string>();
            foreach (var file in files)
            {
                if (AddedFiles.Any(x => x.FileName == file.Name) || Files.Any(x => x.FileName == file.Name))
                    duplicateFileNames.Add(file.Name);
                else
                    AddedFiles.Insert(0, new FileModel { FileName = file.Name, File = file });
            }

            if (duplicateFileNames.Count > 0)
            {
                Snackbar.Add(
                       "Các tập tin trùng tên sẽ không được thêm vào: " + string.Join(", ", duplicateFileNames),
                       Severity.Warning,
                       config =>
                       {
                           config.ShowCloseIcon = false;
                       });
            }
        }

        private async void ViewFile(FileModel selectedFile, bool fromNewList = false)
        {
            if (selectedFile.Extension.ToLower().Contains("pdf"))
            {
                string? base64Data;
                if (fromNewList && selectedFile.File != null)
                    base64Data = await ToBase64Async(selectedFile.File);
                else
                    base64Data = await FileService.GetFileBase64Async(selectedFile.Id);

                if (base64Data != null)
                {
                    var parameters = new DialogParameters { { "DataBase64", base64Data } };
                    var option = new DialogOptions { FullWidth = true, MaxWidth = MaxWidth.Large, CloseButton = true };
                    DialogService.Show<FileViewer>("Trình xem tập tin", parameters, option);
                }
            }
        }

        private async void DownloadFile(FileModel selectedFile, bool fromNewList = false)
        {
            if (fromNewList && selectedFile.File != null)
            {
                using var streamRef = new DotNetStreamReference(stream: await ToMemoryStreamAsync(selectedFile.File));
                await JSRuntime.InvokeVoidAsync("downloadFileFromStream", selectedFile.FileName, streamRef);
            }
            else
            {
                var result = await FileService.DownloadAsync(selectedFile.Id);
                if (result != null)
                {
                    using var streamRef = new DotNetStreamReference(stream: result.GetStream());
                    await JSRuntime.InvokeVoidAsync("downloadFileFromStream", selectedFile.FileName, streamRef);
                }
            }
        }

        private void RemoveFile(FileModel selectedFile, bool fromNewList = false)
        {
            if (fromNewList)
            {
                AddedFiles = AddedFiles.Where(x => x.FileName != selectedFile.FileName).ToList();
            }
            else
            {
                Files = Files.Where(x => x.FileName != selectedFile.FileName).ToList();
                RemoveFiles.Add(selectedFile);
            }
        }

        private async Task SaveFiles(Tbl${name}Dto model)
        {
            //Remove files
            if (RemoveFiles.Count > 0)
            {
                var removeFiles = RemoveFiles.Where(x => x.Id > 0).ToList();

                foreach (var file in removeFiles)
                {
                    await FileService.RemoveAsync(file.Id);
                }
            }

            //Upload files
            if (AddedFiles.Count > 0)
            {
                var remoteStreamContents = new List<RemoteStreamContent>();
                foreach (var file in AddedFiles)
                {
                    if (file.File != null)
                    {
                        remoteStreamContents.Add(new RemoteStreamContent(await ToMemoryStreamAsync(file.File), file.FileName));
                    }
                }

                await FileService.UploadAsync(new FileContentDataUploadDto
                {
                    Type = ModuleContentType,
                    RelatedId = model.Id,
                    Contents = remoteStreamContents
                });
            }
        }

        async Task SubmitAsync(bool stayEdit = false)
        {
            await form.Validate();
            try
            {
                UIGlobalService.ShowLoading();
                if (form.IsValid)
                {
                    Tbl${name}Dto? resultModel;
                    if (Model.Id > 0)
                    {
                        resultModel = await AppService.UpdateAsync(Model.Id, Model);
                    }
                    else
                    {
                        resultModel = await AppService.CreateAsync(Model);
                    }

                    if (resultModel != null)
                    {
                        await SaveFiles(resultModel);

                        Snackbar.Add(
                            "Lưu thành công",
                            Severity.Success,
                            config =>
                            {
                                config.ShowCloseIcon = false;
                            });

                        await FormEventCallback.InvokeAsync(Model);

                        if (stayEdit)
                            await form.ResetAsync();
                        else
                            MudDialog.Close(DialogResult.Ok(true));
                    }
                    else
                    {
                        throw new Exception("Lỗi - Lưu thất bại");
                    }
                }
            }
            catch (Exception ex)
            {
                var message = ex.Message;
                if (ex.Message.Contains("Username"))
                {
                    message = "Tên đăng nhập đã tồn tại";
                }
                else if (ex.Message.Contains("Email"))
                {
                    message = "Thư điện tử đã tồn tại";
                }

                Snackbar.Add(
                       "Lỗi: " + message,
                       Severity.Error,
                       config =>
                       {
                           config.ShowCloseIcon = false;
                       });
            }
            UIGlobalService.HideLoading();
        }

        async Task SubmitAndStayAsync()
        {
            await SubmitAsync(true);
        }

        void Cancel()
        {
            MudDialog.Cancel();
        }

        private async Task<MemoryStream> ToMemoryStreamAsync(IBrowserFile file)
        {
            var bytes = new byte[file.Size];
            var fileStream = file.OpenReadStream(int.MaxValue);
            await fileStream.ReadAsync(bytes);

            return new MemoryStream(bytes);
        }

        private async Task<string> ToBase64Async(IBrowserFile file)
        {
            var bytes = new byte[file.Size];
            var fileStream = file.OpenReadStream(int.MaxValue);
            await fileStream.ReadAsync(bytes);

            return Convert.ToBase64String(bytes);
        }
    }
  `;
    return result;
  }

  private convertDanhSachRazorHeaderContent() {
    let result = "";
    let model = this.emailContentStore.model;

    model.forEach((m) => {
      result += `<MudTh>${m.label}</MudTh>\r\n`
    })
    return result;
  }

  private convertDanhSachRazorRowTemplate() {
    let result = "";
    let model = this.emailContentStore.model;

    model.forEach((m) => {
      result += `<MudTd DataLabel="${m.label}">@context.${m.propertyName}</MudTd>\r\n`
    })
    return result;
  }

  public createDanhSachRazorContent(): string {
    let name = this.emailContentStore.moduleInfo.tableName;
    let result: string = `@page "${this.emailContentStore.moduleInfo.link}"
    @using SMS.DuLieuGTVTService.Models
    @using SMS.MasterService.Models

    <style>
        .action-icon {
            font-size: 24px;
        }
    </style>

    <Search BasicSearchOnClick="BasicSearchOnClick"
            AdvanceSearchOnClick="AdvanceSearchOnClick" />

    <MudCard Class="mt-6">
        <div Style="margin-bottom: 38px;">
            <div class="d-flex justify-space-between align-items-center" style="padding: 15px 24px;">
                <span class="fw-bold" style="font-size: 16px!important;">Kết quả <MudChip Class="chip-result-count">@(TotalCount)</MudChip></span>
                <div>
                    <MudButton Size="Size.Small"
                               Variant="Variant.Filled"
                               StartIcon="@Icons.Material.Filled.Add"
                               Style="height: 36px;font-size: 14px;"
                               Color="Color.Primary"
                               OnClick="CreateOnClick">
                        Thêm mới
                    </MudButton>
                    @if (SelectedItems.Count > 0)
                    {
                        <MudButton Size="Size.Small"
                                   Variant="Variant.Outlined"
                                   IconClass="action-icon"
                                   StartIcon="@DeleteIcon"
                                   Style="margin-left: 8px; border-color: #D0D5DD;width: 88px; height: 36px;font-size: 14px;"
                                   OnClick="BulkDeleteOnClick">
                            Xóa
                        </MudButton>
                    }
                </div>
            </div>
            <MudTable @ref="table"
                      ServerData="@(new Func<TableState, Task<TableData<Tbl${name}Dto>>>(ServerLoadData))"
                      Hover="true"
                      Elevation="0"
                      Dense="true"
                      Bordered="true"
                      Breakpoint="Breakpoint.Sm"
                      Height="calc(100vh - 450px)"
                      FixedHeader="true"
                      MultiSelection="true"
                      Style="width: 100%"
                      @bind-SelectedItems="SelectedItems">
                <HeaderContent>
                    <MudTh>ID</MudTh>
                    ${this.convertDanhSachRazorHeaderContent()}
                    <MudTh Style="width: 130px;text-align: center;">Hành động</MudTh>
                </HeaderContent>
                <RowTemplate>
                    <MudTd DataLabel="Id">@context.Id</MudTd>
                    ${this.convertDanhSachRazorRowTemplate()}
                    <MudTd DataLabel="Tương tác" Style="text-align: center;">
                        <MudIconButton Title="Chi tiết"
                                       Icon="@Icons.Material.Filled.RemoveRedEye"
                                       Color="Color.Info"
                                       Size="Size.Small"
                                       OnClick="() => DetailOnClick(context)" />
                        <MudIconButton Title="Chỉnh sửa"
                                       Icon="@Icons.Material.Filled.Edit"
                                       Color="Color.Success"
                                       Size="Size.Small"
                                       OnClick="() => EditOnClick(context)" />
                        <MudIconButton Title="Xóa"
                                       Icon="@DeleteIcon"
                                       Color="Color.Error"
                                       Size="Size.Small"
                                       Style="font-size: 24px;"
                                       OnClick="() => DeleteOnClick(context.Id)" />
                    </MudTd>
                </RowTemplate>
                <NoRecordsContent>
                    <MudText>Không tìm thấy dữ liệu</MudText>
                </NoRecordsContent>
                <LoadingContent>
                    <MudText>Đang tải...</MudText>
                </LoadingContent>
                <PagerContent>
                    <div class="sms-pagination">
                        <div class="d-flex justify-content-start align-items-center">
                            <span style="margin-top: 2px;">Hiển thị:</span>
                            <MudSelect T="int" ValueChanged="RowsPerPageChanged" Style="width: 65px;" Value="RowsPerPage">
                                <MudSelectItem Value="10" />
                                <MudSelectItem Value="20" />
                                <MudSelectItem Value="50" />
                                <MudSelectItem Value="100" />
                            </MudSelect>
                        </div>
                        <div class="d-flex justify-content-end align-items-center">
                            @(TotalPages) trang
                            <MudIconButton Variant="Variant.Outlined"
                                           Size="Size.Small"
                                           Icon="@Icons.Material.Filled.ArrowBack"
                                           Class="ms-2 me-1 pagination-btn"
                                           Disabled="@(PageIndex == 0)"
                                           OnClick="PageBack" />
                            <MudInput T="int" Variant="Variant.Outlined" Class="pagination-btn" ReadOnly="true" Value="PageCount"></MudInput>
                            <MudIconButton Variant="Variant.Outlined"
                                           Size="Size.Small"
                                           Icon="@Icons.Material.Filled.ArrowForward"
                                           Class="ms-1 pagination-btn"
                                           Disabled="@(PageCount*RowsPerPage >= TotalCount)"
                                           OnClick="PageNext" />
                        </div>
                    </div>
                </PagerContent>
            </MudTable>
        </div>
    </MudCard>
  `;
    return result;
  }

  public createDanhSachCSContent(): string {
    let name = this.emailContentStore.moduleInfo.tableName;
    let result: string = `
    using Microsoft.AspNetCore.Components;
    using MudBlazor;
    using Newtonsoft.Json;
    using SMS.Blazor.Pages.Components;
    using SMS.Blazor.Services;
    using SMS.Domain.Shared.Models;
    using SMS.DuLieuGTVTService.Models;
    using SMS.DuLieuGTVTService.Services;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    namespace SMS.Blazor.Pages.Admin.${this.emailContentStore.moduleInfo.nameSpace};

    public partial class DanhSach
    {
        [Inject] IDialogService DialogService { get; set; } = null!;
        [Inject] ISnackbar Snackbar { get; set; } = null!;
        [Inject] I${name}AppService AppService { get; set; } = null!;
        [Inject] UIGlobalService UiGlobalService { get; set; } = null!;

        private MudTable<Tbl${name}Dto> table { get; set; } = null!;

        private int RowsPerPage { get; set; } = 10;

        private int PageIndex { get; set; } = 0;

        private int PageCount => PageIndex + 1;

        private int TotalPages => TotalCount % RowsPerPage > 0 ? TotalCount / RowsPerPage + 1 : TotalCount / RowsPerPage;

        private int TotalCount { get; set; } = 0;

        private HashSet<Tbl${name}Dto> SelectedItems = new HashSet<Tbl${name}Dto>();
        private IList<Tbl${name}Dto> Items = new List<Tbl${name}Dto>();

        private string? BasicSearch { get; set; }

        private Tbl${name}Dto? AdvanceSearch { get; set; }

        private string DeleteIcon = @"<svg width=""18"" height=""24"" viewBox=""0 0 18 18"" fill=""none"" xmlns=""http://www.w3.org/2000/svg"">
    <path d=""M2.525 18C2.125 18 1.775 17.85 1.475 17.55C1.175 17.25 1.025 16.9 1.025 16.5V2.25H0V0.75H4.7V0H11.3V0.75H16V2.25H14.975V16.5C14.975 16.9 14.825 17.25 14.525 17.55C14.225 17.85 13.875 18 13.475 18H2.525ZM13.475 2.25H2.525V16.5H13.475V2.25ZM5.175 14.35H6.675V4.375H5.175V14.35ZM9.325 14.35H10.825V4.375H9.325V14.35ZM2.525 2.25V16.5V2.25Z"" fill=""#FF8A00""/>
    </svg>
    ";

        private async Task<TableData<Tbl${name}Dto>> ServerLoadData(TableState state)
        {
            var list = await AppService.GetListAsync(
                new ExtendPagedAndSortedResultRequestDto
                {
                    MaxResultCount = RowsPerPage,
                    SkipCount = PageIndex * RowsPerPage,
                    Filter = BasicSearch,
                    JsonFilterObject = JsonConvert.SerializeObject(AdvanceSearch)
                });
            TotalCount = list != null ? (int)list.TotalCount : 0;

            if (list != null)
            {
                Items = list.Items.ToList();
            }

            StateHasChanged();
            return new TableData<Tbl${name}Dto>() { TotalItems = TotalCount, Items = Items };
        }

        private async Task BasicSearchOnClick(string? search)
        {
            BasicSearch = search;
            AdvanceSearch = null;
            await table.ReloadServerData();
        }

        private async Task AdvanceSearchOnClick(Tbl${name}Dto search)
        {
            AdvanceSearch = search;
            BasicSearch = null;
            await table.ReloadServerData();
        }

        private void RowsPerPageChanged(int newValue)
        {
            RowsPerPage = newValue;
            table.ReloadServerData();
        }

        private void PageNext()
        {
            PageIndex++;
            table.ReloadServerData();
        }

        private void PageBack()
        {
            PageIndex--;
            table.ReloadServerData();
        }

        private void DetailOnClick(Tbl${name}Dto model)
        {
            var parameters = new DialogParameters
            {
                { "ShowDetail", true },
                { "Model",model }
            };
            var options = new DialogOptions
            {
                FullWidth = true,
                MaxWidth = MaxWidth.Medium,
                DisableBackdropClick = true,
                CloseOnEscapeKey = true,
            };
            DialogService.Show<FormDialog>("Xem Thông Tin Chi Tiết", parameters, options);
        }

        private void CreateOnClick()
        {
            var parameters = new DialogParameters
            { { "FormEventCallback", new EventCallbackFactory().Create(this, FormDialogCallback) }, };
            var options = new DialogOptions { FullWidth = true, MaxWidth = MaxWidth.Medium, CloseOnEscapeKey = true, DisableBackdropClick = true, };
            DialogService.Show<FormDialog>("Thêm Mới", parameters, options);
        }

        private void EditOnClick(Tbl${name}Dto model)
        {
            var parameters = new DialogParameters
            {
                { "Model", model },
                { "FormEventCallback", new EventCallbackFactory().Create(this, FormDialogCallback) },
            };
            var options = new DialogOptions { FullWidth = true, MaxWidth = MaxWidth.Medium, CloseOnEscapeKey = true, DisableBackdropClick = true, };
            DialogService.Show<FormDialog>("Chỉnh Sửa", parameters, options);
        }

        private void DeleteOnClick(int deleteId)
        {
            var parameters = new DialogParameters
            {
                { "ContentText", "Bạn có chắc muốn xóa dữ liệu này?" },
                { "Color", Color.Secondary },
                { "ButtonText", "Xóa" },
                {
                    "ConfirmEventCallback",
                    new EventCallbackFactory().Create<bool>(this, (isDelete) => DeleteConfirmed(isDelete, deleteId))
                },
            };
            var options = new DialogOptions { FullWidth = true, MaxWidth = MaxWidth.ExtraSmall, };

            DialogService.Show<ConfirmDialog>(string.Empty, parameters, options);
        }

        private void BulkDeleteOnClick()
        {
            var parameters = new DialogParameters
            {
                { "ContentText", "Bạn có chắc muốn xóa những dữ liệu này?" },
                { "Color", Color.Secondary },
                { "ButtonText", "Xóa" },
                { "ConfirmEventCallback", new EventCallbackFactory().Create<bool>(this, BulkDeleteConfirmed) },
            };
            var options = new DialogOptions { FullWidth = true, MaxWidth = MaxWidth.ExtraSmall, };

            DialogService.Show<ConfirmDialog>(string.Empty, parameters, options);
        }

        private async Task DeleteConfirmed(bool isDelete, int deleteId)
        {
            if (isDelete)
            {
                UiGlobalService.ShowLoading();
                try
                {
                    await AppService.DeleteAsync(deleteId);
                    Snackbar.Add(
                        "Xóa thành công",
                        Severity.Success,
                        config =>
                        {
                            config.ShowCloseIcon = false;
                        });
                    await table.ReloadServerData();
                }
                catch (Exception ex)
                {
                    Snackbar.Add("Lỗi: " + ex.Message, Severity.Error);
                }
                UiGlobalService.HideLoading();
            }
        }

        private async Task BulkDeleteConfirmed(bool isDelete)
        {
            if (isDelete)
            {
                UiGlobalService.ShowLoading();
                try
                {
                    foreach (var item in SelectedItems)
                    {
                        await AppService.DeleteAsync(item.Id);
                    }
                    Snackbar.Add(
                        "Xóa thành công",
                        Severity.Success,
                        config =>
                        {
                            config.ShowCloseIcon = false;
                        });
                    await table.ReloadServerData();
                }
                catch (Exception ex)
                {
                    Snackbar.Add("Lỗi: " + ex.Message, Severity.Error);
                }
                UiGlobalService.HideLoading();
            }
        }

        private async Task FormDialogCallback() { await table.ReloadServerData(); }
    }
  `;
    return result;
  }

  public createAppServiceContent(): string {
    let name = this.emailContentStore.moduleInfo.tableName;
    let result: string = `using Newtonsoft.Json;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using SMS.Domain.Shared.Models;
    using SMS.DuLieuGTVTService.Entities;
    using SMS.DuLieuGTVTService.Models;
    using Volo.Abp.Application.Dtos;
    using Volo.Abp.Application.Services;
    using Volo.Abp.Domain.Repositories;
    using System.Linq;

    namespace SMS.DuLieuGTVTService.Services;

    public class ${name}AppService : CrudAppService<Tbl${name}, Tbl${name}Dto, int, ExtendPagedAndSortedResultRequestDto, Tbl${name}Dto, Tbl${name}Dto>, I${name}AppService
    {
        public ${name}AppService(IRepository<Tbl${name}, int> repository) : base(repository)
        {
        }

        public override async Task<PagedResultDto<Tbl${name}Dto>> GetListAsync(ExtendPagedAndSortedResultRequestDto input)
        {
            var query = await Repository.GetQueryableAsync();
            if (string.IsNullOrEmpty(input.JsonFilterObject))
            {
                query = query
                    .WhereIf(!string.IsNullOrWhiteSpace(input.Filter),
                        x =>
                        ${this.convertAppServiceContentGetListQuery()}
                        )
                    .AsQueryable();
            }
            else
            {
                var filter = JsonConvert.DeserializeObject<Tbl${name}Dto>(input.JsonFilterObject);
                if (filter == null)
                    return await base.GetListAsync(input);

                query = query
                ${this.convertAppServiceContentGetListFilter()}
                    .AsQueryable();
            }

            var count = await AsyncExecuter.LongCountAsync(query);
            var list = await AsyncExecuter.ToListAsync(query.OrderBy(x => x.Id).PageBy(input.SkipCount, input.MaxResultCount));

            return new PagedResultDto<Tbl${name}Dto>(
                count,
                ObjectMapper.Map<List<Tbl${name}>, List<Tbl${name}Dto>>(list)
            );
        }
    }
  `;
    return result;
  }

  private convertAppServiceContentGetListFilter() {
    let result = "";
    let model = this.emailContentStore.model;

    model.forEach((m) => {
      result += `.WhereIf(!string.IsNullOrWhiteSpace(filter.${m.propertyName}), x => x.${m.propertyName}.Contains(filter.${m.propertyName}))\r\n`
    })
    return result;
  }

  private convertAppServiceContentGetListQuery() {
    let result = "";
    let model = this.emailContentStore.model;

    model.forEach((m, i) => {
      result += `x.${m.propertyName}.Contains(input.Filter!) ${i == (model.length - 1) ? '' : '||'}\r\n`
    })
    return result;
  }

  public createIAppServiceContent(): string {
    let name = this.emailContentStore.moduleInfo.tableName;
    let result: string = `using SMS.Domain.Shared.Models;
      using SMS.DuLieuGTVTService.Models;
      using Volo.Abp;
      using Volo.Abp.Application.Services;

      namespace SMS.DuLieuGTVTService.Services;

      public interface I${name}AppService : ICrudAppService<Tbl${name}Dto, int, ExtendPagedAndSortedResultRequestDto, Tbl${name}Dto, Tbl${name}Dto>, IRemoteService
      {
      }
  `;
    return result;
  }

  public createDtoContent(): string {
    let name = this.emailContentStore.moduleInfo.tableName;
    let result: string = `
    using System.ComponentModel.DataAnnotations;
    using SMS.Domain.Shared;
    using Volo.Abp.Application.Dtos;

    namespace SMS.DuLieuGTVTService.Models;

    public class Tbl${name}Dto : AuditedEntityDto<int>
    {
      ${this.convertDtoModel()}
    }
  `;
    return result;
  }

  private convertDtoModel() {
    let result = "";
    let model = this.emailContentStore.model;

    model.forEach(m => {
      if (m.isRequired)
        result += "[Required(ErrorMessage = SmsConstants.ErrorMessages.RequiredMessage)]\r\n";

      if (m.maxLength || m.maxLength > 0)
        result += `[StringLength(${m.maxLength}, ErrorMessage = SmsConstants.ErrorMessages.MaxLenghtMessage + "${m.maxLength}")]\r\n`

      result += `public ${m.type} ${m.propertyName}${m.isRequired ? "" : "?"} { get; set; } = null!;\r\n`
    })
    return result
  }

  public createEntityContent(): string {
    let result: string = `
    using System.ComponentModel.DataAnnotations;
    using Volo.Abp.Domain.Entities.Auditing;
    using System.ComponentModel.DataAnnotations.Schema;

    namespace SMS.DuLieuGTVTService.Entities;

    [Table(\"Tbl_${this.emailContentStore.moduleInfo.tableName}\")]
    public class Tbl${this.emailContentStore.moduleInfo.tableName} : AuditedEntity<int>
    {
          ${this.convertEntityModel()}
  }
  `;
    return result;
  }

  private convertEntityModel() {
    let result = "";
    let model = this.emailContentStore.model;

    model.forEach(m => {
      if (m.maxLength || m.maxLength > 0)
        result += `[StringLength(${m.maxLength})]\r\n`

      result += `public ${m.type} ${m.propertyName}${m.isRequired ? "" : "?"} { get; set; } = null!;\r\n`

    })
    return result
  }

}
