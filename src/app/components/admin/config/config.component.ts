import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { PageComponent } from "../../../models/view.models/menu.model";
import { MenuItems } from 'src/app/models/enums';
import { Tag } from 'src/app/models/entities/tag.entity';
import { ConfigService } from 'src/app/services/config.service';
import { Config } from 'src/app/models/entities/config.entity';
import { NgForm } from '@angular/forms';
import { RealtimeService } from 'src/app/services/realtime.service';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent extends BaseComponent {

  protected PageCompnent: PageComponent = new PageComponent('Cài đặt', MenuItems.Config);

  config: Config;

  constructor(private customerService: CustomerService, private configService: ConfigService, private realTimeService: RealtimeService) {
    super();
    this.config = new Config();
  }

  protected Init() {

    this.configService.getCurrentConfig()
      .then(data => {

        this.config = data;
      });
  }

  updateConfigValue(form: NgForm) {

    if (this.config.VVipValue > this.config.VipValue
      && this.config.VipValue > this.config.MemberValue
      && this.config.MemberValue > 0) {

      this.configService.updateConfig(this.config)
        .then(res => {

          this.showInfo('Đã cập nhật Hạn mức thành viên.');

          this.openConfirm('Bạn có muốn cập nhật lại thông tin thành viên của tất cả KH?', () => {

            this.customerService.updateAllCustomerMemberType(this.config).then(data => {
              this.realTimeService.forceAccountLogout();
            });

          });

        });

    } else {
      this.showError('Giá trị không hợp lệ!');
    }

  }

  updateConfigDiscount(form: NgForm) {

    if (
      this.config.VVipDiscount <= 100
      && this.config.VVipDiscount > this.config.VipDiscount
      && this.config.VipDiscount > this.config.MemberDiscount
      && this.config.MemberDiscount > 0) {

      this.configService.updateConfig(this.config)
        .then(res => {

          this.showInfo('Đã cập nhật mức giảm giá cho thành viên');

          this.realTimeService.forceAccountLogout();

        });

    } else {
      this.showError('Giá trị không hợp lệ!');
    }

  }
}
