jQuery(document).ready(function () {
    // custom number input
    jQuery(".popup-content img.item-detail-thumb").click(function () {
        var imgSource = jQuery(this).attr("src");
        appendInBody();
        jQuery("body").append("<div class='popup-image'><img src='" + imgSource + "'></div>");
        jQuery(".popup-image").show(250);
        jQuery(".overlay-dark").click(function () {
            jQuery(".popup-image").remove();
            jQuery(this).remove();
        })
    });
})

function filterFocus() {

    let Filter = jQuery('.filterCate').parent();
    if (Filter.hasClass("search")) {
        Filter.removeClass("search");
    }
}

function searchFocus(e) {
    let Filter = jQuery(e).parent();
    if (!Filter.hasClass("search")) {
        Filter.addClass("search");
    }

    jQuery('.prodFilter .filterSearch .form-control').first().focus();
}

function createNumbericElement(isDisabled, calback) {
    jQuery('<div class="quantity-button quantity-down">-</div>').insertBefore('.prodQuantity input');
    jQuery('<div class="quantity-button quantity-up">+</div>').insertAfter('.prodQuantity input');
    jQuery('.prodQuantity').each(function () {
        var spinner = jQuery(this),
            input = spinner.find('input[type="number"]'),
            btnUp = spinner.find('.quantity-up'),
            btnDown = spinner.find('.quantity-down'),
            min = input.attr('min');

        if (isDisabled) {
            return;
        }

        btnUp.click(function () {


            var oldValue = parseFloat(input.val());
            var newVal = oldValue + 1;
            spinner.find("input").val(newVal);
            spinner.find("input").trigger("change");
            calback(newVal);
        });

        btnDown.click(function () {

            var oldValue = parseFloat(input.val());
            if (oldValue <= min) {
                var newVal = oldValue;
            } else {
                var newVal = oldValue - 1;
            }
            spinner.find("input").val(newVal);
            spinner.find("input").trigger("change");

            calback(newVal);

        });

    });
}

// append 2 element
function appendInBody() {

    if (jQuery("body").find(".overlay-dark").length) {
        jQuery("body").append("<div class='overlay-dark layer2'></div>");
        return false;
    }
    else {
        jQuery("body").append("<div class='overlay-dark'></div>");
        return true;
    }
}

// slide canvas menu
function customerSupport() {

    jQuery("body").append("<div class='overlay-dark'></div>");
    jQuery(".customer-support").css({
        "left": "0",
        "opacity": "1"
    });

    jQuery(".customer-support #logoutBtn").one("click", function () {
        jQuery(".overlay-dark").remove();
    });

    jQuery(".overlay-dark").one("click", function () {
        jQuery(".customer-support #logoutBtn").off("click");
        jQuery(".customer-support").css({
            "left": "-80vw",
            "opacity": "0"
        });
        jQuery(this).remove();
    });
}

// Menu Đơn hàng
function menuOpen(callback, items) {

    var itemsContent = "";
    let index = 0;

    items.forEach(function (item) {
        itemsContent += `<li><a class="menu-item-dynamic" data-value="${index}" >${item}</a></li>`;
        index += 1;
    });


    var html = `<div class="actionMenu">
        <ul>
           ${itemsContent}
        </ul>
    </div>`;

    slideUp(html, function (index) {
        callback(index);
    });
}

// Menu Danh sách hoa
function selectProductCategory(menuItems, callback) {
    actionMenuSelecting(menuItems, callback);
}

function actionMenuSelecting(menuItems, callback) {

    let templateRes = '';

    menuItems.forEach(element => {
        var item = `<li><a class="menu-item-dynamic" data-index="0" data-value="${element.Value}"  href="javascript:void(0)">${element.Name}</a></li>`;
        templateRes += item;
    });

    var html = `<div class="actionMenu">
    <ul>
     ${templateRes}
    </ul>
    </div>`;

    slideUp(html, function (index) {
        callback(index);
    });
}

// Menu tiến độ
function openProgMenu() {
    var html = `<div class="actionMenu">
        <ul>
            <li><a class="menu-item-dynamic" data-index="0" href="javascript:void(0)">Nhận đơn</a></li>
            <li><a  class="menu-item-dynamic" data-index="1"  href="javascript:void(0)">Chi tiết sản phẩm</a></li>
        </ul>
        </div>`;
    slideUp(html, function (index) {
        switch (index) {
            case '0': alert("Nhận đơn"); break;
            case '1': window.location = './chi-tiet.html'; break;
        }
    });
}

// Menu hoàn thành đơn
function openCompMenu() {
    var html = `<div class="actionMenu">
        <ul>
            <li><a class="menu-item-dynamic" data-index="0" href="javascript:void(0)">Hoàn thành đơn</a></li>
            <li><a  class="menu-item-dynamic" data-index="1"  href="javascript:void(0)">Chi tiết sản phẩm</a></li>
        </ul>
        </div>`;
    slideUp(html, function (index) {
        switch (index) {
            case '0': alert("Hoàn thành đơn"); break;
            case '1': window.location = './chi-tiet.html'; break;
        }
    });
}

// Menu Danh sách Khách hàng
function openCustMenu() {

    appendInBody();
    jQuery("#recentInfo").slideDown(350);

    jQuery(".overlay-dark:not(.layer2)").click(function () {
        jQuery("#recentInfo").slideUp(250, function () {
            jQuery(".overlay-dark").remove();
        });
    });
}

function selectSavedDeliveryInfo(e) {

    let index = parseInt(jQuery(e).attr('data-index'));

    window.DeliveryInfoReference.zone.run(() => { window.DeliveryInfoReference.selectDeliveryInfo(index); });

    jQuery("#recentInfo").slideUp(250, function () {
        jQuery(".overlay-dark").remove();
    });
}

// SlideUp Action menu
function slideUp(html, callback) {

    appendInBody();
    jQuery("body").append(html);

    jQuery(".actionMenu").slideDown(350);
    //click vào menu
    jQuery('.actionMenu a.menu-item-dynamic').one('click', function () {

        var index = jQuery(this).attr('data-index');
        var val = jQuery(this).attr('data-value');

        jQuery(".actionMenu").slideUp(250, function () {
            jQuery(".actionMenu").remove();
            jQuery(".overlay-dark").remove();
            callback(val);
        });
    });

    jQuery(".overlay-dark:not(.layer2)").one('click', function () {
        jQuery(".actionMenu").slideUp(250, function () {
            jQuery(".overlay-dark").remove();
            jQuery(this).remove();
        });
    })

    jQuery(".overlay-dark.layer2").click(function () {
        jQuery(".actionMenu").slideUp(250, function () {
            jQuery(".overlay-dark.layer2").remove();
            jQuery(this).remove();
        });
    });

}

function messageDialog(title, message) {

    let isFirstLayer = appendInBody();

    var html = `<div id="loginerror" class="popup-content">
    <img src="../../../assets/images/alert.png" alt="">
    <p>${title}</p>
    <span>${message}</span>
    </div>`

    jQuery("body").append(html);

    jQuery("#loginerror").fadeIn(350);

    let overlayClasses = '';

    if (isFirstLayer) {
        overlayClasses = '.overlay-dark:not(.layer2)';
    } else {
        overlayClasses = '.overlay-dark.layer2';
    }

    jQuery(overlayClasses).one("click", function () {
        jQuery("#loginerror").hide(250, function () {
            jQuery(overlayClasses).remove();
            jQuery(this).remove();
        });
    });
}
// HIển thị quét QR
function openQR() {
    appendInBody();
    jQuery("#codeQR").fadeIn(350);

    jQuery(".overlay-dark:not(.layer2)").click(function () {
        jQuery("#codeQR").hide(250, function () {
            jQuery(".overlay-dark").remove();
        });
    });
}

// Hiển thị bảng màu
function openColorBoard() {
    appendInBody();
    jQuery("#colorBoard").fadeIn(350);

    jQuery(".overlay-dark:not(.layer2)").click(function () {
        jQuery("#colorBoard").hide(250, function () {
            jQuery(".overlay-dark").remove();
        });
    });
}

// Thêm thông tin
function openAddInfo() {
    appendInBody();
    jQuery("#infoAdd").fadeIn(350);

    jQuery(".overlay-dark:not(.layer2)").one('click', function () {
        jQuery("#infoAdd").hide(250, function () {
            jQuery(".overlay-dark").remove();
        });
    });

    jQuery('#infoAdd #cancel-button').one('click', function () {
        jQuery("#infoAdd").hide(250, function () {
            jQuery(".overlay-dark").remove();
        });
    });
}

function closeAddCustomerDialog() {
    jQuery("#infoAdd").hide(250, function () {
        jQuery(".overlay-dark").remove();
    });
}

// Hiển thị xác nhận đơn
function openOrderConfirm() {
    appendInBody();
    jQuery("#orderConfirm").fadeIn(350);

    jQuery(".overlay-dark:not(.layer2)").click(function () {
        jQuery("#orderConfirm").hide(250, function () {
            jQuery(".overlay-dark").remove();
        });
    });
}

// Hiển thị xác nhận đơn
function openDeliConfirm() {
    appendInBody();
    jQuery("#deliConfirm").fadeIn(350);

    jQuery(".overlay-dark:not(.layer2)").click(function () {
        jQuery("#deliConfirm").hide(250, function () {
            jQuery(".overlay-dark").remove();
        });
    });
}

//Hiển thị số lượt xem
function openViewed() {
    appendInBody();
    jQuery("#viewed").fadeIn(350);

    jQuery(".overlay-dark:not(.layer2)").click(function () {
        jQuery(".popup-content").hide(250, function () {
            jQuery(".overlay-dark").remove();
        });
    });
}


// Thêm thông tin
function openExcForm(callback) {

    let input = jQuery('#exchangeAdd #exchange-val').first();
    input.val('');

    let isFirstLayer = appendInBody();

    let overlayClasses = '';

    if (isFirstLayer) {
        overlayClasses = '.overlay-dark:not(.layer2)';
    } else {
        overlayClasses = '.overlay-dark.layer2';
    }

    jQuery("#exchangeAdd").fadeIn(350);

    input.focus();

    jQuery('#exchangeAdd .exchange-confirm').off('click');

    jQuery('#exchangeAdd .exchange-confirm').on('click', function () {

        let input = jQuery('#exchangeAdd #exchange-val').first();

        let val = input.val();

        if (!val || parseInt(val) < 0) {
            warningToast('Yêu cầu nhập số dương');
            return;
        }

        callback(parseInt(val), function (isSuccess) {

            if (!isSuccess) {
                return;
            }

            jQuery("#exchangeAdd").hide(250, function () {
                jQuery(overlayClasses).remove();
            });

        });
    });

    jQuery(overlayClasses).one('click', function () {
        jQuery("#exchangeAdd").hide(250, function () {
            jQuery(overlayClasses).remove();
        });
    });
}

function getNumberValidateInput(callback, placeHolder, oldValue) {

    var html = `<div id="inputDialog" class="popup-content dialog-popup"><div class="form-group">
    <input type="number" name="" id="input-value" class="mainForm" value="${oldValue}" placeholder="${placeHolder}"></div>
    <div class="row"><div class="col-6"><button id="confirm-button" class=" main-btn btn">Xác nhận</button></div>
    <div class="col-6"><button  id="cancel-button" class=" main-bg border btn">Hủy</button></div></div></div>`;

    appendInBody();

    jQuery("body").append(html);
    jQuery("#inputDialog").fadeIn(350);

    jQuery(".overlay-dark").one('click', function () {
        jQuery("#inputDialog").hide(250, function () {
            jQuery(".overlay-dark").remove();
            jQuery(this).remove();
        });
    });

    jQuery('#inputDialog #cancel-button').one('click', function () {
        jQuery("#inputDialog").hide(250, function () {
            jQuery(".overlay-dark").remove();
            jQuery(this).remove();
        });
    });

    jQuery('#inputDialog #confirm-button').on('click', function () {

        var val = jQuery('#inputDialog #input-value').first().val();

        if (!val) {
            return;
        }

        if (parseInt(val) === NaN) {
            return;
        }

        callback(parseInt(val), function (isValid, error) {

            if (!isValid) {
                warningToast(error);
                return;
            }

            jQuery(this).off('click');

            jQuery("#inputDialog").hide(250, function () {
                jQuery(".overlay-dark").remove();
                jQuery(this).remove();
            });

        });

    });

}

function getNumberInput(callback, placeHolder, oldValue) {

    var html = `<div id="inputDialog" class="popup-content dialog-popup"><div class="form-group">
    <input type="number" name="" id="input-value" class="mainForm" value="${oldValue}" placeholder="${placeHolder}"></div>
    <div class="row"><div class="col-6"><button id="confirm-button" class=" main-btn btn">Xác nhận</button></div>
    <div class="col-6"><button  id="cancel-button" class=" main-bg border btn">Hủy</button></div></div></div>`;

    appendInBody();

    jQuery("body").append(html);
    jQuery("#inputDialog").fadeIn(350);

    jQuery(".overlay-dark").one('click', function () {
        jQuery("#inputDialog").hide(250, function () {
            jQuery(".overlay-dark").remove();
            jQuery(this).remove();
        });
    });

    jQuery('#inputDialog #cancel-button').one('click', function () {
        jQuery("#inputDialog").hide(250, function () {
            jQuery(".overlay-dark").remove();
            jQuery(this).remove();
        });
    });

    jQuery('#inputDialog #confirm-button').one('click', function () {

        var val = jQuery('#inputDialog #input-value').first().val();

        if (!val) {
            return;
        }

        if (parseInt(val) === NaN) {
            return;
        }


        jQuery("#inputDialog").hide(250, function () {
            jQuery(".overlay-dark").remove();
            jQuery(this).remove();
            callback(parseInt(val));
        });

    });

}

function selectItem(e, className) {

    jQuery(className).removeClass('selected');

    jQuery(e).addClass('selected');

    window.searchProdReference.zone.run(() => { window.searchProdReference.itemSelected(jQuery(e).attr('data-id')); });

}

function setSelectedCustomerItem(id) {
    jQuery('#customer-list').each(function () {
        jQuery(this).find('.customer-item').each(function () {
            let itemId = jQuery(this).attr('data-id');
            if (itemId === id) {
                jQuery(this).addClass('selected');
            }
        })
    })
}

// HIển thị dialog xác nhận
function openConfirm(message, okCallback, noCallback, cancelCallback) {

    let html = `<div id="confirmDialog" class="popup-content dialog-popup">
                <img src="../../../assets/images/confirm.png" alt="">
                <p>${message}</p>
                <div class="row"><div class="col-6"><button class=" main-btn btn" id="success-btn">Có</button></div>
                <div class="col-6"><button class=" main-bg border btn" id="cancel-btn">Không</button></div></div>
                </div>`;

    appendInBody();

    jQuery("body").append(html);

    jQuery("#confirmDialog").fadeIn(350);

    jQuery('#confirmDialog #success-btn').one('click', function () {

        jQuery("#confirmDialog").hide(250, function () {
            jQuery(".overlay-dark").remove();
            jQuery(this).remove();

            if (okCallback != undefined)
                okCallback();
        });

    });

    jQuery('#confirmDialog #cancel-btn').one('click', function () {

        jQuery("#confirmDialog").hide(250, function () {

            jQuery(this).remove();
            jQuery(".overlay-dark").remove();

            if (noCallback != undefined)
                noCallback();
        });


    });

    jQuery(".overlay-dark").one('click', function () {
        jQuery("#confirmDialog").hide(250, function () {
            jQuery(this).remove();
            jQuery(".overlay-dark").remove();

            if (noCallback != undefined) {
                noCallback();
            } else {
                if (cancelCallback != undefined) {
                    cancelCallback();
                }
            }

        });
    });

}

function openTagMenu() {

    jQuery("body").append("<div class='overlay-dark' id='tags-menu-bg'></div>");

    jQuery("#tagsMenu").slideDown(250);

    jQuery("#tags-menu-bg").one('click', function () {

        jQuery("#tagsMenu").slideUp(250, function () {
            jQuery("#tags-menu-bg").remove();
            window.searchProdReference.zone.run(() => { window.searchProdReference.tagsSelected(); });
        });
    });
}

function addressRequest(districts, resCallback, requestNewWards) {

    let districtData = `<option value="NULL">Quận/Huyện</option>`;

    districts.forEach(function (district) {
        districtData += `<option value="${district.Id}">${district.Name}</option>`
    });

    let htmlTemplate = `<div id="addressAdd" class="popup-content">
        <div class="form-group">
            <select class="mainForm" name="" id="district-select">
              ${districtData}
            </select>
        </div>
        <div class="form-group">
            <select class="mainForm" name="" id="ward-select">
                <option value="0">Phường/Xã</option>
            </select>
        </div>
        <div class="form-group">
            <input type="text" name="" id="address-detail" class="mainForm" placeholder="Số nhà - Tên đường...">
        </div>
        <div class="row">
            <div class="col-6 mx-auto text-center">
                <button type="button" id="cancel-btn" class="btn grey-btn w-100 mt-3">Hủy</button>
            </div>
            <div class="col-6 mx-auto text-center">
                <button type="button" id="submit-btn" class="btn main-btn w-100 mt-3">Lưu</button>
            </div>
        </div>
        </div>`;

    appendInBody();

    jQuery("body").append(htmlTemplate);

    jQuery("#addressAdd").fadeIn(350);

    jQuery('#addressAdd #district-select').on('change', function () {

        let selectedId = '';
        $("#addressAdd #district-select option:selected").each(function () {
            selectedId = $(this).val();
        });

        let newWardsData = `<option value="0">Phường/Xã</option>`;

        requestNewWards(selectedId, function (newWards) {

            console.log(newWards);

            newWards.forEach(function (newWard) {
                newWardsData += `<option value="${newWard.Id}">${newWard.Name}</option>`;
            });

            jQuery('#addressAdd #ward-select').html(newWardsData);

        });
    })

    jQuery("#addressAdd #submit-btn").on('click', function () {

        let district = $("#addressAdd #district-select option:selected").first().text();
        let ward = $("#addressAdd #ward-select option:selected").first().text();
        let detail = $('#addressAdd #address-detail').val();

        let fullAddress = `${detail} ${ward} ${district}`;

        resCallback(fullAddress);

        jQuery('#addressAdd').hide(250, function () {
            jQuery(this).remove();
            jQuery(".overlay-dark:not(.layer2)").remove();
        });

    });

    jQuery(".overlay-dark:not(.layer2)").click(function () {
        jQuery('#addressAdd').hide(250, function () {
            jQuery(this).remove();
            jQuery(".overlay-dark").remove();
        });
    });
}

let rotationAmount = 0;
function rotateImage() {
    rotationAmount += 90;

    document.querySelector('#selected-image').style.transform = `rotate(${rotationAmount}deg)`;

}