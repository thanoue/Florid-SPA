function getMomoConfig() {
    if (typeof Android !== "undefined" && Android !== null) {
        return JSON.parse(Android.geMomoConfig());
    }
    else return {
        partnerCode: 'MOMO6B4T20200319',
        storeId: 'florid_1',
        secretkey: 'gPefAYXMR3jQQ44bBU4oRjIzOC6Awsa0',
        accessKey: 'kcWTrI6rGUHxnFlq',
        publicKey: 'MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAqxVXfFBhTYk6kOYbdPK9jx5ZH7Im5PR0g6JWhrmPbFo1mQE/vgM0uc2MH6VF/fuxQUOGFmtNnBNyZgnWYWHUCL4/fYql0AdtvwFYrSnVwbJXdyhrYSrMD1uOIgVORn1h/9WlkHKIn40YT5c/3p7GDofqwX65HanLGKDb9FJRXPtoo0yv0OVRQxL1QVvkXpQMa2ZK8mSBz04wYNw5LPvtXKEoTQTjcVSK1+JWsltaF9qOvIK4GiuqnY17uFoVcBD7cutyim4HxG7j97/ac4s0zP/48wlPNsn6vCc20XrtIhb3iGMxPrxMiQUhzvgnPcQ81a4OcUUTFMcXUTmeOYQwn8Rq/p0rQJcADyif267h/HvaJNxtowdesdxlBSlAd0JyalG8Y+7FxwsWu0YiX5PQhedJuUjj1CW86DwIM8FH9NDjvCRoo4f/Ap5F7DpJtwywrqi7nkUsD9U8EOLggk6+X5D8LsODnbuuLnpZDz281goH52ovsZhujN2SE3ErXaXF7YPvRxPVMd+m4VYW+fGtK5JU4rfFkux+W5WId7EaWxNdP0E5eMcMQhnbuBZQAvFG+KxN11GKc7RHtJM+9hBfBvMRiL7MtXDrbLOiipBigRXyxBX85zwuepi7YQAhDeuktQI9bpEB+R+xU7PZHMdXZ5b/zNnB8dc/pE+7ZFmFWSkCAwEAAQ=='
    }
}

function deviceLogin(email, password, isPrinter, idToken) {
    if (typeof Android !== "undefined" && Android !== null) {
        Android.login(email, password, isPrinter, idToken);
    }
}

function setStatusBarColor(isDark) {
    if (typeof Android !== "undefined" && Android !== null) {
        Android.setStatusBarColor(isDark);
    }
}

function doPrintJob(data) {
    console.log('native js');
    if (typeof Android !== "undefined" && Android !== null) {
        Android.doPrintJob(JSON.stringify(data));
    }
}


function getInput(resCallback) {

    // if (typeof Android !== "undefined" && Android !== null) {
    //     Android.getInput(function (res) {
    //         resCallback(res);
    //     });
    // }
}

function getDateSelecting(year, month, day) {
    if (typeof Android !== "undefined" && Android !== null) {
        Android.requestDateSelecting(year, month, day);
    }
}

function setDate(year, month, day) {
    window.BaseReference.zone.run(() => { window.BaseReference.dateSelected(year, month, day); });
}

function getTimeSelecting(hour, minute) {
    if (typeof Android !== "undefined" && Android !== null) {
        Android.requestTimeSelecting(hour, minute);
    }
}

function setTime(hour, minute) {
    window.BaseReference.zone.run(() => { window.BaseReference.timeSelected(hour, minute); });
}

function getDateTimeSelecting(year, month, day, hour, minute) {

    if (isOnTerminal()) {
        Android.requestDateTimeSelecting(year, month, day, hour, minute);
    } else {

        let deafaultDate = new Date();

        deafaultDate.setFullYear(year);
        deafaultDate.setMonth(month);
        deafaultDate.setDate(day);

        deafaultDate.setHours(hour);
        deafaultDate.setMinutes(minute);
        deafaultDate.setSeconds(0);

        // var timePicker = new DateTimePicker.Time({
        //     default: deafaultDate,
        //     minuteStep: 5   
        // })
        // timePicker.on('selected', function (formatTime, now) {
        //     console.log('selected time: ', formatTime, now)
        //     //time.value = formatTime
        // })
        // timePicker.on('cleared', function () {
        //     console.log('cleared time')
        //     // time.value = ''
        // });
        // timePicker.show();

        var datePicker = new DateTimePicker.Date({
            lang: 'vi-VN',
            default: deafaultDate,
            min: '2018-01-01',
            max: '2025-12-31'
        }, {
            day: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
            shortDay: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
            MDW: 'D, MM-dd',
            YM: 'yyyy-MM',
            OK: 'Xác nhận',
            CANCEL: 'huỷ',
            CLEAR: 'Xoá'
        });

        datePicker.on('selected', function (formatDate, now) {
            console.log('selected date: ', formatDate, now);
            //date.value = formatDate
        });
        datePicker.on('cleared', function () {
            console.log('cleared date')
            // date.value = ''
        });
        datePicker.show();

    }

}


function setDateTime(year, month, day, hour, minute) {
    window.BaseReference.zone.run(() => { window.BaseReference.dateTimeSelected(year, month, day, hour, minute); });
}

function backNavigate() {
    window.BaseReference.zone.run(() => { window.BaseReference.forceBackNavigate(); });
}

function isOnTerminal() {
    if (typeof Android !== "undefined" && Android !== null) {
        return true;
    }
    else return false;
}

function fileChosen(path) {
    window.BaseReference.zone.run(() => { window.BaseReference.fileChosen(path); });
}

function getProductsFromCache(category) {

    if (typeof Android !== "undefined" && Android !== null) {
        return Android.getProductsFromCache(category);
    }
    else return 'NONE';
}

function addProductsToCache(products) {

    if (typeof Android !== "undefined" && Android !== null) {
        Android.addProductsToCache(JSON.stringify(products));
    }

    return;
}

function alert(message, alertType) {

    if (typeof Android !== "undefined" && Android !== null) {
        Android.alert(message, alertType);
    } else {
        window.ToastReference.zone.run(() => { window.ToastReference.toastShowing(message, alertType); });
    }

    return;
}

function errorToast(message) {
    alert(message, 1);
}

function successToast(message) {
    alert(message, 2)
}

function infoToast(message) {
    alert(message, 0)
}

function warningToast(message) {
    alert(message, 3)
}

function pickFile(isSaveUrl) {
    if (typeof Android !== "undefined" && Android !== null) {
        if (isSaveUrl) {
            Android.pickFileForShare();
        } else {
            Android.pickFile();
        }
    }

    return;
}

function deleteTempImage() {
    if (typeof Android !== "undefined" && Android !== null) {
        Android.releaseTempImage();
    }
    return;
}

function shareImageCus(contactInfo) {

    if (typeof Android !== "undefined" && Android !== null) {
        Android.shareImage(contactInfo);
    }
    return;
}

function shareImageCusWithData(img, contactInfo) {

    if (typeof Android !== "undefined" && Android !== null) {

        Android.shareNewImage(img, contactInfo);

    } else {
        var res = `${contactInfo}FLORID${img}`;
        webkit.messageHandlers.callback.postMessage(res);
    }

    return;
}