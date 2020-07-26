import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { PageComponent } from 'src/app/models/view.models/menu.model';
import { MenuItems, Roles } from 'src/app/models/enums';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/entities/user.entity';
import { ROLES, IMAGE_FOLDER_PATHS } from 'src/app/app.constants';
import { NgForm } from '@angular/forms';
import { UserAvtService } from 'src/app/services/userr.avt.service';
import { UserAvtImage } from 'src/app/models/entities/file.entity';
import { FunctionsService } from 'src/app/services/common/functions.service';
import { Guid } from 'guid-typescript';
import { ExchangeService } from 'src/app/services/exchange.service';
declare function hideAdd(): any;
declare function showUserEditPopup(): any;
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html'
})
export class UsersComponent extends BaseComponent {

  users: {
    User: User,
    Role: string,
    IsSelected: boolean,
  }[];

  isSelectAll: boolean;
  currrentEditUser: User = new User();
  edittingImageUrl: any;
  edittingFile: File;

  protected PageCompnent: PageComponent = new PageComponent('Nhân Viên', MenuItems.User);


  constructor(private userService: UserService, private userAvtImageService: UserAvtService) {
    super();
  }

  protected Init() {
    this.users = [];
    this.loadUsers();
  }

  deleteUser(userId: number) {
    this.openConfirm("Chắn chắn xoá User này ?", () => {

      let user = this.users.filter(p => p.User.Id == userId)[0];

      this.userService.deleteUser(userId, user.User.AvtUrl).then(() => {
        this.loadUsers();
      });
    });

  }

  loadUsers() {

    this.users = [];
    this.userService.getAll()
      .then(users => {

        users.forEach(user => {

          let role = ROLES.filter(p => p.Role.toString() == user.Role.toString())[0];

          this.users.push({
            User: user,
            Role: user.Role,
            IsSelected: false
          });

        });

      });
  }

  onChange(event) {

    const filesUpload: File = event.target.files[0];

    var mimeType = filesUpload.type;
    if (mimeType.match(/image\/*/) == null) {
      this.showError('Phải chọn hình !!');
      return;
    }

    this.edittingFile = filesUpload;

    var reader = new FileReader();

    reader.readAsDataURL(filesUpload);
    reader.onload = (_event) => {
      this.edittingImageUrl = reader.result.toString();
    }

  }

  checkAllChange(isSelected) {
    this.users.forEach(user => {
      user.IsSelected = isSelected;
    });
    this.isSelectAll = isSelected;
  }

  addUserRequest() {
    this.edittingFile = null;
    this.edittingImageUrl = "";
    this.currrentEditUser = new User();
    showUserEditPopup();
  }

  selectUserToEdit(user: User) {

    Object.assign(this.currrentEditUser, user);

    // this.edittingImageUrl = ExchangeService.getFullImgUrl(IMAGE_FOLDER_PATHS.user_avt, this.currrentEditUser.AvtUrl);

    this.edittingFile = null;

    this.currrentEditUser.Password = '';

    showUserEditPopup();

  }

  editUser(form: NgForm) {

    if (!form.valid)
      return;

    if (this.currrentEditUser.Password == '') {

      if (!this.currrentEditUser.Id) {
        this.showError('Thiếu mật khẩu!!');
        return;
      }
    }


    if (this.currrentEditUser.Id) {

      this.userService.updateUser(this.currrentEditUser, this.edittingFile).then(user => {

        this.stopLoading();

        this.currrentEditUser = new User();
        this.edittingImageUrl = '';
        this.edittingFile = null;

        if (user == null) {
          return;
        }

        hideAdd();
        this.loadUsers();

      });

      return;
    }

    this.userService.insertUser(this.currrentEditUser, this.edittingFile).then(user => {

      this.stopLoading();

      if (user == null) {
        return;
      }

      this.loadUsers();
      this.currrentEditUser = new User();
      this.edittingImageUrl = '';
      this.edittingFile = null;
      this.stopLoading();

      hideAdd();

    });

  }
}
