
function initLeftMenu() {
    jQuery(".mainMenu li.hasChildren").append(`<span class="showSubMenu"></span>`);
    jQuery(".showSubMenu").click(function () {
        jQuery(this).parent().toggleClass("show");
    });

    jQuery(".menuToggle").click(function () {
        jQuery(".adminWrapper").toggleClass("mini");
    });


}

function confirmDialog(message, yesCallback, noCallback, cancelCallback) {

    var htmlConfirm = `<div class="popupDialog" id="confirmDialog">
    <h4 class="confirmText">${message}</h4>
    <div class="confirmAct">
        <button class="yes btn btn-info" id="yesBtnConfirmDialog">Yes</button>
        <button class="no btn btn-outline-info" id="noBtnConfirmDialog">No</button>
    </div>
        </div>`;

    jQuery("body").append("<div class='overlayDiv'></div>");

    jQuery("body").append(htmlConfirm);

    jQuery("#confirmDialog").fadeIn(350);

    jQuery('#yesBtnConfirmDialog').one('click', function () {

        jQuery("#confirmDialog").hide(250, function () {

            jQuery('.overlayDiv').remove();
            jQuery(this).remove();

            if (yesCallback == undefined)
                return;

            yesCallback();
        });

        jQuery('.overlayDiv').off('click');
        jQuery('#noBtnConfirmDialog').off('click');
    })

    jQuery('#noBtnConfirmDialog').one('click', function () {

        jQuery("#confirmDialog").hide(250, function () {

            jQuery('.overlayDiv').remove();
            jQuery(this).remove();

            if (noCallback == undefined)
                return;

            noCallback();

        });

        jQuery('.overlayDiv').off('click');
        jQuery('#yesBtnConfirmDialog').off('click');
    })

    jQuery('.overlayDiv').one("click", function () {

        jQuery("#confirmDialog").hide(250, function () {

            jQuery('.overlayDiv').remove();
            jQuery(this).remove();

            if (cancelCallback == undefined)
                return;

            cancelCallback();

        });

        jQuery('#yesBtnConfirmDialog').off('click');
        jQuery('#noBtnConfirmDialog').off('click');
    });

}

function messageDialog(message, okCallback) {

    jQuery("body").append("<div class='overlayDiv'></div>");

    var html = `<div class="popupDialog" id="messageDialog">
    <h4 class="confirmText">${message}</h4>
    <div class="confirmAct">
        <button class="no btn btn-info" id="okBtnMsgDialog">OK</button>
    </div>
    </div>`

    jQuery("body").append(html);

    jQuery("#messageDialog").fadeIn(350);

    jQuery('#okBtnMsgDialog').one('click', function () {
        jQuery("#messageDialog").hide(250, function () {
            jQuery('.overlayDiv').remove();
            jQuery(this).remove();
            if (okCallback == undefined)
                return;
            okCallback();
        });
    })

    jQuery('.overlayDiv').one("click", function () {
        jQuery("#messageDialog").hide(250, function () {
            jQuery('.overlayDiv').remove();
            jQuery(this).remove();
        });
    });
}

function cusOrdersBinding() {

    jQuery(".openOrderProducts").click(function () {
        jQuery(this).next().toggle(250);
    });

}

//Add New Object
showAddNew = (obj) => {
    var html;
    switch (obj) {
        case "user":
            html = `<div class="popupContent" id="userAdd">
        <h4 class="userName">Thêm mới Nhân Viên</h4>
        <hr class="adminSeperate">
        <form action="">
        <div class="form-row">
        <div class="form-group col-md-6">
        <label for="inputEmail4">Địa chỉ Email</label>
        <input type="email" class="form-control" id="inputEmail4" placeholder="thanhhnp@gmail.com">
        </div>
        <div class="form-group col-md-6">
        <label for="inputPassword4">Mật khẩu</label>
        <input type="password" class="form-control" id="inputPassword4" placeholder="***********" >
        </div>
    </div>
    <div class="form-row">
        <div class="form-group col-md-6">
            <label for="inputName">Họ và Tên</label>
            <input type="text" class="form-control" id="inputName" placeholder="Adriana C. Ocampo Uria">
        </div>
        <div class="form-group col-md-6">
            <label for="inputPhone">Số điện thoại</label>
            <input type="text" class="form-control" id="inputPhone" placeholder="0898443222">
        </div>
    </div>
    <div class="form-row">
        <div class="form-group col-md-4">
            <label for="selectDist">Quận/Huyện</label>
            <select class="form-control" name="" id="selectDist">
                <option value="0">Quận/Huyện</option>
                <option value="1">Quận 1</option>
                <option value="2">Quận 2</option>
                <option value="3">Quận 10</option>
                <option value="4">Quận 11</option>
            </select>
        </div>
        <div class="form-group col-md-4">
            <label for="selectWard">Phường/Xã</label>
            <select class="form-control" name="" id="selectWard">
                <option value="0">Phường/Xã</option>
                <option value="1">Đa Kao</option>
                <option value="2">Bến Nghé</option>
            </select>
        </div>
        <div class="form-group col-md-4">
            <label for="inputAddress">Địa chỉ</label>
            <input type="text" class="form-control" id="inputAddress" placeholder="13A Đinh Tiên Hoàng - Q1 - TP. Hồ Chí Minh">
        </div>
    </div>
    <div class="form-row">
        
        <div class="form-group col-md-3">
            <label for="inputState">Quyền</label>
                <select id="inputState" class="form-control">
                <option selected>Choose...</option>
                <option >Account</option>
                <option>Shipper</option>
                <option>Florist</option>
                <option>Other</option>
            </select>
        </div>
    </div>
          <div class="form-group avatarChange">
            <label for="">Chọn ảnh đại diện</label>
            <input type="file" class="form-control-file" name="" id="" placeholder="" aria-describedby="fileHelpId">
          </div>
          <div class="form-action row">
            <div class="col-md-3">
                <div class="btn-group w-100">
                    <button type="" class="btn btn-outline-success w-100" onclick="">Thêm Mới</button>
                    <a href="javascript:void(0)" class="btn btn-outline-secondary" onclick="hideAdd()">Hủy</a>
                </div>
            </div>
        </div> 
        </form>
      </div>
        `; break;
        case "customer":
            html = `<div class="popupContent" id="customerAdd">
            <h4 class="userName">Thêm mới Khách Hàng</h4>
            <hr class="adminSeperate">
            <form action="">
            <div class="form-row">
            <div class="form-group col-md-6">
            <label for="inputEmail4">Địa chỉ Email</label>
            <input type="email" class="form-control" id="inputEmail4" placeholder="thanhhnp@gmail.com">
            </div>
            <div class="form-group col-md-6">
            <label for="inputPassword4">Mật khẩu</label>
            <input type="password" class="form-control" id="inputPassword4" placeholder="***********" >
            </div>
        </div>
        <div class="form-row">
            <div class="form-group col-md-6">
                <label for="inputName">Họ và Tên</label>
                <input type="text" class="form-control" id="inputName" placeholder="Adriana C. Ocampo Uria">
            </div>
            <div class="form-group col-md-6">
                <label for="inputPhone">Số điện thoại</label>
                <input type="text" class="form-control" id="inputPhone" placeholder="0898443222">
            </div>
        </div>
        <div class="form-row">
            <div class="form-group col-md-4">
                <label for="selectDist">Quận/Huyện</label>
                <select class="form-control" name="" id="selectDist">
                    <option value="0">Quận/Huyện</option>
                    <option value="1">Quận 1</option>
                    <option value="2">Quận 2</option>
                    <option value="3">Quận 10</option>
                    <option value="4">Quận 11</option>
                </select>
            </div>
            <div class="form-group col-md-4">
                <label for="selectWard">Phường/Xã</label>
                <select class="form-control" name="" id="selectWard">
                    <option value="0">Phường/Xã</option>
                    <option value="1">Đa Kao</option>
                    <option value="2">Bến Nghé</option>
                </select>
            </div>
            <div class="form-group col-md-4">
                <label for="inputAddress">Địa chỉ</label>
                <input type="text" class="form-control" id="inputAddress" placeholder="13A Đinh Tiên Hoàng - Q1 - TP. Hồ Chí Minh">
            </div>
        </div>
                <div class="form-action row">
                <div class="col-md-3">
                    <div class="btn-group w-100">
                        <button type="" class="btn btn-outline-success w-100" onclick="">Thêm Mới</button>
                        <a href="javascript:void(0)" class="btn btn-outline-secondary" onclick="hideAdd()">Hủy</a>
                    </div>
                </div>
            </div> 
            </form>
            </div>
            `; break;
        case "product":
            html = `<div class="popupContent" id="productAdd">
        <h4 class="userName">Thêm mới Sản phẩm</h4>
        <hr class="adminSeperate">
        <form action="">
        
    <div class="form-row">
        <div class="form-group col-md-4">
            <label for="inputName">Mã Sản Phẩm</label>
            <input type="text" class="form-control" id="inputName" placeholder="SP-009">
        </div>
        <div class="form-group col-md-4">
            <label for="inputPrice">Giá Gốc (vnđ)</label>
            <input type="number" class="form-control" id="inputPrice" placeholder="200000">
        </div>
        <div class="form-group col-md-4">
            <label for="inputCate">Loại Sản Phẩm</label>
                <select id="inputCate" class="form-control">
                <option selected>Choose...</option>
                <option >Hoa Hồng</option>
                <option>Hoa Hướng Dương</option>
                <option>Hoa Lyly</option>
                <option>Hoa Cẩm Chướng</option>
                </select>
        </div>
    </div>
    <div class="form-row">
        <div class="form-group col-md-6">
            <label for="inputDesc">Mô tả</label>
            <textarea id="inputDesc" class="form-control" cols="100" rows="5" placeholder="Mô tả sản phẩm"></textarea>
        </div>
        <div class="form-group col-md-6">
            <label for="inputTag">Tag</label>
            <div class="tagAdd">
                <input type="text" class="form-control" value="" placeholder="Nhập tag mới">
                <span class="addTagBtn">Thêm</span>
            </div>
            <div class="showTags"></div>
            <ul class="tagList">
                <li><span class="badge badge-pill badge-info p-2" onclick="selectTag(event)">hoa</span></li>
                <li><span class="badge badge-pill badge-info p-2" onclick="selectTag(event)">hoa-hong</span></li>
                <li><span class="badge badge-pill badge-info p-2" onclick="selectTag(event)">hoa-tuoi</span></li>
                <li><span class="badge badge-pill badge-info p-2" onclick="selectTag(event)">hoa-lyly</span></li>
                <li><span class="badge badge-pill badge-info p-2" onclick="selectTag(event)">bo-hoa</span></li>
            </ul>
        </div>
    </div>
    <div class="form-group avatarChange">
            <label for="">Chọn ảnh đại diện</label>
            <input type="file" class="form-control-file" name="" id="" placeholder="" aria-describedby="fileHelpId">
          </div>
          <div class="form-action row">
            <div class="col-md-2"><button type="" class="btn btn-outline-success w-100" onclick="">Thêm Mới</button></div>
            <div class="col-md-1"><a href="javascript:void(0)" class="btn btn-outline-secondary w-100" onclick="hideAdd()">Hủy</a></div>
        </div> 
        </form>
      </div>
        `; break;
        case "tag":
            html = `<div class="popupContent" id="tagAdd">
        <h4 class="userName">Thêm mới Tag Sản phẩm</h4>
        <hr class="adminSeperate">
        <form action="">
    <div class="form-row">
        <div class="form-group col-md-6">
            <label for="inputName">Tên Hiển Thị</label>
            <input type="text" class="form-control" id="inputName" placeholder="Hoa Hồng">
        </div>
        <div class="form-group col-md-6">
            <label for="inputPrice">Giá Trị</label>
            <input type="text" class="form-control" id="inputValue" placeholder="hoa-hong">
        </div>
    </div>
    <div class="form-row">
        <div class="form-group col-md-12">
            <label for="inputDesc">Mô tả</label>
            <textarea id="inputDesc" class="form-control" cols="100" rows="5" placeholder="Mô tả sản phẩm"></textarea>
        </div>
    </div>
          <div class="form-action row">
            <div class="col-md-3">
                <div class="btn-group w-100">
                    <button type="" class="btn btn-outline-success w-100" onclick="">Thêm Mới</button>
                    <a href="javascript:void(0)" class="btn btn-outline-secondary" onclick="hideAdd()">Hủy</a>
                </div>
            </div>
        </div> 
        </form>
      </div>
        `; break;
        case "cate":
            html = `<div class="popupContent" id="cateAdd">
        <h4 class="userName">Thêm mới Danh mục Sản phẩm</h4>
        <hr class="adminSeperate">
        <form action="">
            <div class="form-row">
                <div class="form-group col-md-6">
                    <label for="inputName">Mã Danh Mục</label>
                    <input type="text" class="form-control" id="inputName" placeholder="DM_01">
                </div>
                <div class="form-group col-md-6">
                    <label for="inputPrice">Tên Danh Mục</label>
                    <input type="text" class="form-control" id="inputValue" placeholder="Giỏ hoa tươi">
                </div>
            </div>
            <div class="form-action row">
                <div class="col-md-3">
                    <div class="btn-group w-100">
                        <button type="" class="btn btn-outline-success w-100" onclick="">Thêm Mới</button>
                        <a href="javascript:void(0)" class="btn btn-outline-secondary" onclick="hideAdd()">Hủy</a>
                    </div>
                </div>
            </div> 
        </form>
      </div>
        `; break;
        default:
            break;
    }
    jQuery(".adminWrapper").append(html);
    jQuery(".popupContent").slideDown(350);
}

function showReceiverSetupPopup() {
    jQuery('#receiverAdd').slideDown(350);
}

function showProductSetupPopup() {
    jQuery('#productAdd').slideDown(350);
}

function showCustomerSetupPopup() {
    jQuery('#customerAdd').slideDown(350);
}

function showTagEditPopup() {
    jQuery("#tagAddPopup").slideDown(350);
}

function showCategoryEditPopup() {
    jQuery("#categoryAddPopup").slideDown(350);
}

function showUserEditPopup() {
    jQuery('#userAdd').slideDown(350);
}


hideAdd = () => {
    jQuery(".popupContent").slideUp(250, function () {
    });

}

showUserEdit = (e) => {
    var trCurrent = jQuery(e.target).parents("tr");
    jQuery(trCurrent).html(`
        <td scope="row" colspan="6">
            <form class="userEdit">
                <div class="row">
                    <div class="col-md-2 col-xs-12">
                        <div class="userAvatar">
                            <img src="../images/product-img.jpg" alt="..." class="img-thumbnail rounded-circle">
                        </div>
                        <div class="form-group avatarChange">
                            <label for="">Thay đổi ảnh đại diện</label>
                            <input type="file" class="form-control-file" name="" id="" placeholder="" aria-describedby="fileHelpId">
                        </div>
                    </div>
                    <div class="col-md-10 col-xs-12">
                        <h4 class="userName">Adriana C. Ocampo Uria | ID: 211</h4>
                        <div class="form-row">
                            <div class="form-group col-md-6">
                            <label for="inputEmail4">Địa chỉ Email</label>
                            <input type="email" class="form-control" id="inputEmail4" value="thanhhnp@gmail.com" disabled>
                            </div>
                            <div class="form-group col-md-6">
                            <label for="inputPassword4">Mật khẩu</label>
                            <input type="password" class="form-control" id="inputPassword4" value="#)$*)$*%K#J%*#%)*(" disabled>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group col-md-6">
                                <label for="inputName">Họ và Tên</label>
                                <input type="text" class="form-control" id="inputName" value="Adriana C. Ocampo Uria">
                            </div>
                            <div class="form-group col-md-6">
                                <label for="inputPhone">Số điện thoại</label>
                                <input type="text" class="form-control" id="inputPhone" value="0898443222">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group col-md-4">
                                <label for="selectDist">Quận/Huyện</label>
                                <select class="form-control" name="" id="selectDist">
                                    <option value="0">Quận/Huyện</option>
                                    <option value="1">Quận 1</option>
                                    <option value="2">Quận 2</option>
                                    <option value="3">Quận 10</option>
                                    <option value="4">Quận 11</option>
                                </select>
                            </div>
                            <div class="form-group col-md-4">
                                <label for="selectWard">Phường/Xã</label>
                                <select class="form-control" name="" id="selectWard">
                                    <option value="0">Phường/Xã</option>
                                    <option value="1">Đa Kao</option>
                                    <option value="2">Bến Nghé</option>
                                </select>
                            </div>
                            <div class="form-group col-md-4">
                                <label for="inputAddress">Địa chỉ</label>
                                <input type="text" class="form-control" id="inputAddress" value="13A Đinh Tiên Hoàng - Q1 - TP. Hồ Chí Minh">
                            </div>
                        </div>
                        <div class="form-row">
                            
                            <div class="form-group col-md-3">
                                <label for="inputState">Quyền</label>
                                    <select id="inputState" class="form-control">
                                    <option>Choose...</option>
                                    <option selected>Account</option>
                                    <option>Shipper</option>
                                    <option>Florist</option>
                                    <option>Other</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>  
                <div class="form-action row">
                    <div class="col-md-2"><button type="" class="btn btn-outline-success w-100" onclick="hideUserEdit(event)">Lưu</button></div>
                    <div class="col-md-1"><button type="" class="btn btn-outline-secondary w-100" onclick="hideUserEdit(event)">Hủy</button></div>
                </div> 
            </form>
        </td>
    `);

}

hideUserEdit = (e) => {
    var trCurrent = jQuery(e.target).parents("tr");
    jQuery(trCurrent).html(`
    <td scope="row">
        <div class="form-check">
        <label class="form-check-label">
            <input type="checkbox" class="form-check-input" name="" id="" value="checkedValue">
            1
        </label>
        </div>
    </td>
    <td>
        <a href="javascript:void(0)" class="tdName" onclick="showUserEdit(event)">Adriana C. Ocampo Uria</a>
    </td>
    <td>0898222999</td>
    <td>Adriana C. Ocampo Uria st. TP. Hồ Chí Minh</td>
    <td>
        <span class="badge badge-pill badge-success d-block p-2">Account</span>
    </td>
    <td>
        <div class="btn-group">
            <button type="button" class="btn btn-outline-info"  onclick="showUserEdit(event)"><i class="fa fa-pencil"></i> Sửa</button>
            <button type="button" class="btn btn-outline-danger"><i class="fa fa-remove"></i> Xóa</button>
        </div>
    </td>
    `);
}


showProductEdit = (e) => {
    var trCurrent = jQuery(e.target).parents("tr");
    jQuery(trCurrent).html(`
        <td scope="row" colspan="7">
            <form class="userEdit">
                <div class="row">
                    <div class="col-md-2 col-xs-12">
                        <div class="userAvatar">
                            <img src="../images/product-img.jpg" alt="..." class="img-thumbnail rounded-circle">
                        </div>
                        <div class="form-group avatarChange">
                            <label for="">Thay đổi ảnh đại diện</label>
                            <input type="file" class="form-control-file" name="" id="" placeholder="" aria-describedby="fileHelpId">
                        </div>
                    </div>
                    <div class="col-md-10 col-xs-12">
                        <h4 class="userName">MS-1505 | ID: 211</h4>
                        <div class="form-row">
                            <div class="form-group col-md-4">
                                <label for="inputName">Mã Sản Phẩm</label>
                                <input type="text" class="form-control" id="inputName" value="MS-1505">
                            </div>
                            <div class="form-group col-md-4">
                                <label for="inputPrice">Giá Gốc</label>
                                <input type="number" class="form-control" id="inputPrice" value="200000">
                            </div>
                            <div class="form-group col-md-4">
                                <label for="inputCate">Loại Sản Phẩm</label>
                                    <select id="inputCate" class="form-control">
                                    <option>Choose...</option>
                                    <option >Hoa Hồng</option>
                                    <option selected>Bó Hoa Tươi</option>
                                    <option>Hoa Lyly</option>
                                    <option>Hoa Cẩm Chướng</option>
                                    </select>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group col-md-6">
                                <label for="inputDesc">Mô tả</label>
                                <textarea id="inputDesc" class="form-control" cols="100" rows="5">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nulla quos libero atque quisquam officiis facere laboriosam dignissimos explicabo, in iste debitis illum dicta iure earum. Sequi quis voluptatum sapiente reprehenderit.</textarea>
                            </div>
                            <div class="form-group col-md-6">
                                <label for="inputTag">Tag</label>
                                <div class="tagAdd">
                                    <input type="text" class="form-control" value="" placeholder="Nhập tag mới">
                                    <span class="addTagBtn">Thêm</span>
                                </div>
                                <div class="showTags"><span onclick='removeTag(event)'>hoa</span><span onclick='removeTag(event)'>hoa-tuoi</span></div>
                                <ul class="tagList">
                                    <li><span class="badge badge-pill badge-info p-2" onclick="selectTag(event)">hoa-hong</span></li>
                                    <li><span class="badge badge-pill badge-info p-2" onclick="selectTag(event)">hoa-lyly</span></li>
                                    <li><span class="badge badge-pill badge-info p-2" onclick="selectTag(event)">bo-hoa</span></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>  
                <div class="form-action row">
                    <div class="col-md-2"><button type="" class="btn btn-outline-success w-100" onclick="hideProductEdit(event)">Lưu</button></div>
                    <div class="col-md-1"><button type="" class="btn btn-outline-secondary w-100" onclick="hideProductEdit(event)">Hủy</button></div>
                </div> 
            </form>
        </td>
    `);

}
hideProductEdit = (e) => {
    var trCurrent = jQuery(e.target).parents("tr");
    jQuery(trCurrent).html(`
    <td scope="row">
                          <div class="form-check">
                            <label class="form-check-label">
                              <input type="checkbox" class="form-check-input" name="" id="" value="checkedValue">
                              2
                            </label>
                          </div>
                        </td>
                        <td>
                          <img src="../images/product-img.jpg" alt="" class="productImg">
                        </td>
                        <td>
                          <a href="javascript:void(0)" class="tdName" onclick="showProductEdit(event)">MS 1505</a>
                        </td>
                        <td>200.000 vnđ</td>
                        <td>
                          Bó Hoa Tươi
                        </td>
                        <td>
                          <span class="badge badge-pill badge-success d-inline-block p-1 mb-1">Hoa</span>
                          <span class="badge badge-pill badge-success d-inline-block p-1 mb-1">Tươi</span>
                          <span class="badge badge-pill badge-success d-inline-block p-1 mb-1">Hoa hong</span>
                          <span class="badge badge-pill badge-success d-inline-block p-1 mb-1">Hồng</span>
                        </td>
                        <td>
                            <div class="btn-group">
                              <button type="button" class="btn btn-outline-info"  onclick="showProductEdit(event)"><i class="fa fa-pencil"></i> Sửa</button>
                            <button type="button" class="btn btn-outline-danger"><i class="fa fa-remove"></i> Xóa</button>
                            </div>
                        </td>
    `);
}


showTagEdit = (e) => {
    var trCurrent = jQuery(e.target).parents("tr");
    jQuery(trCurrent).html(`
        <td scope="row" colspan="5">
            <form class="tagEdit">
                <div class="row">
                    <div class="col-md-12 col-xs-12">
                        <h4 class="userName">Hoa Hồng | ID: hoa-hong</h4>
                        <div class="form-row">
                            <div class="form-group col-md-6">
                                <label for="inputName">Tên Hiển thị</label>
                                <input type="text" class="form-control" id="inputName" value="Hoa Hồng">
                            </div>
                            <div class="form-group col-md-6">
                                <label for="inputPrice">Giá trị</label>
                                <input type="text" class="form-control" id="inputValue" value="hoa-hong">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group col-md-12">
                                <label for="inputDesc">Mô tả</label>
                                <textarea id="inputDesc" class="form-control" cols="100" rows="5">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nulla quos libero atque quisquam officiis facere laboriosam dignissimos explicabo, in iste debitis illum dicta iure earum. Sequi quis voluptatum sapiente reprehenderit.</textarea>
                            </div>
                        </div>
                    </div>
                </div>  
                <div class="form-action row">
                    <div class="col-md-2"><button type="" class="btn btn-outline-success w-100" onclick="hideTagEdit(event)">Lưu</button></div>
                    <div class="col-md-1"><button type="" class="btn btn-outline-secondary w-100" onclick="hideTagEdit(event)">Hủy</button></div>
                </div> 
            </form>
        </td>
    `);

}
hideTagEdit = (e) => {
    var trCurrent = jQuery(e.target).parents("tr");
    jQuery(trCurrent).html(`
    <td scope="row">
        <div class="form-check">
        <label class="form-check-label">
            <input type="checkbox" class="form-check-input" name="" id="" value="checkedValue">
            1
        </label>
        </div>
    </td>
    <td>
        <a href="javascript:void(0)" class="tdName" onclick="showTagEdit(event)">Hoa Hồng</a>
    </td>
    <td>hoa-hong</td>
    <td>Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis beatae, commodi in quis perferendis nostrum mollitia, quaerat nihil neque ducimus earum ad nisi quam doloribus ratione distinctio iusto harum sequi!</td>
    <td>
        <div class="btn-group">
            <button type="button" class="btn btn-outline-info"  onclick="showTagEdit(event)"><i class="fa fa-pencil"></i> Sửa</button>
        <button type="button" class="btn btn-outline-danger"><i class="fa fa-remove"></i> Xóa</button>
        </div>
    </td>
    `);
}

selectTag = (e) => {
    var selectedTag = jQuery(e.target).text();
    var currentShow = jQuery(".showTags").html();

    jQuery(".showTags").html(currentShow + "<span onclick='removeTag(event)'>" + selectedTag + "</span>");
    jQuery(e.target).parent("li").remove();
}
removeTag = (e) => {
    var removedTag = jQuery(e.target).text();
    jQuery("ul.tagList").append("<li><span class='badge badge-pill badge-info p-2' onclick='selectTag(event)'>" + removedTag + "</span></li>");
    jQuery(e.target).remove();
}

showCateEdit = (e) => {
    var trCurrent = jQuery(e.target).parents("tr");
    jQuery(trCurrent).html(`
        <td scope="row" colspan="4">
            <form class="cateEdit">
                <div class="row">
                    <div class="col-md-12 col-xs-12">
                        <h4 class="userName">Giỏ Hoa Tươi | ID: DM_01</h4>
                        <div class="form-row">
                            <div class="form-group col-md-6">
                                <label for="inputName">Mã Danh mục</label>
                                <input type="text" class="form-control" id="inputName" value="DM_01">
                            </div>
                            <div class="form-group col-md-6">
                                <label for="inputPrice">Tên Danh mục</label>
                                <input type="text" class="form-control" id="inputValue" value="Giỏ Hoa Tươi">
                            </div>
                        </div>
                    </div>
                </div>  
                <div class="form-action row">
                    <div class="col-md-2"><button type="" class="btn btn-outline-success w-100" onclick="hideCateEdit(event)">Lưu</button></div>
                    <div class="col-md-1"><button type="" class="btn btn-outline-secondary w-100" onclick="hideCateEdit(event)">Hủy</button></div>
                </div> 
            </form>
        </td>
    `);

}
hideCateEdit = (e) => {
    var trCurrent = jQuery(e.target).parents("tr");
    jQuery(trCurrent).html(`
    <td scope="row">
        <div class="form-check">
        <label class="form-check-label">
            <input type="checkbox" class="form-check-input" name="" id="" value="checkedValue">
            1
        </label>
        </div>
    </td>
    <td>
        <a href="javascript:void(0)" class="tdName" onclick="showCateEdit(event)">DM_01</a>
    </td>
    <td>Giỏ Hoa Tươi</td>
    <td>
        <div class="btn-group">
            <button type="button" class="btn btn-outline-info"  onclick="showCateEdit(event)"><i class="fa fa-pencil"></i> Sửa</button>
        <button type="button" class="btn btn-outline-danger"><i class="fa fa-remove"></i> Xóa</button>
        </div>
    </td>
    `);
}
