import { EmailContentStore } from './../email-content.store';
import { Component } from '@angular/core';
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
      label: "Tên bến xe",
      maxLength: 150,
      type: "string",
      propertyName: "Name"
    },
    {
      isRequired: true,
      label: "Mã bến xe",
      maxLength: 150,
      type: "string",
      propertyName: "Code"
    },
    {
      isRequired: false,
      label: " Vị trí",
      type: "string",
      propertyName: "Location"
    },
    {
      isRequired: false,
      label: "Diện tích",
      type: "decimal",
      propertyName: "AreaAmount"
    },
    {
      isRequired: false,
      label: "Năm thành lập",
      type: "string",
      propertyName: "YearOfEstablishment"
    },
    {
      isRequired: false,
      label: "Tuyến xe",
      type: "string",
      propertyName: "BusRoute"
    },
  ]

  Model: IProperty = {
    label: "Quản Lý Hồ Sơ Phương Tiện Giao Thông Đường Bộ",
    nameSpace: "QuanLyCSDLBaoCaoTongHopVaThongKe.BaoCaoBenXe",
    tableName: "BusStationReport",
    link: "/admin/quan-ly-csdl-baocao-tonghop-thongke/baocao-benxe",
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
