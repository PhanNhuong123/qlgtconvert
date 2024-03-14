import { EmailContentStore } from './../email-content.store';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { EProperty, IProperty, IPropertyModel, ITemplate } from 'src/app/app.constant';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent {

  constructor(private emailContentStore: EmailContentStore, private router: Router) { }

  // Sửa cái này.... -----------------------------------------------------------------


  modelx: Array<IPropertyModel> = [
    {
      isRequired: true,
      label: "Tên Hồ Sơ",
      maxLength: 150,
      type: "string",
      propertyName: "Name"
    },
    {
      isRequired: true,
      label: "Mã Số Hồ Sơ",
      maxLength: 150,
      type: "string",
      propertyName: "Code"
    }
  ]

  Model: IProperty = {
    label: "Quản Lý Hồ Sơ Phương Tiện Giao Thông Đường Bộ",
    nameSpace: "QuanLyCSDLHoSoVanTaiPhuongTienNguoiLai.QuanLyHoSoGiayPhepVePhuongTienVaNguoiLai.QuanLyHoSoPhuongTienGiaoThongDuongBo",
    tableName: "RoadTrafficVehicleDocumentation",
    link: "/admin/quan-ly-csdl-ho-so-van-tai-phuong-tien-nguoi-lai/ho-so-giay-phep/phuong-tien-giao-thong-duong-bo",
    model: JSON.stringify(this.modelx)
  };

  // ------------------------------------------------------------------------------------

  EProperty = EProperty;

  public onInputChange(event: Event, property: IProperty, tap: keyof IProperty): void {
    event.preventDefault();
    if (property[tap] !== undefined) {
      property[tap] = (event.target as HTMLInputElement)?.value ?? '';
    }
  }

  public processing(): void {
    let model: Array<IPropertyModel> = JSON.parse(this.Model.model);

    if (!(model?.length > 0))
          console.log("model null");

    this.emailContentStore.updateModel(model);
    this.emailContentStore.updateModuleInfo(this.Model);
    this.emailContentStore.updateIsProcess(true);

    this.router.navigateByUrl("/query");
    this.emailContentStore.updateCurrentTab(this.emailContentStore.properties[0])
  }
}
