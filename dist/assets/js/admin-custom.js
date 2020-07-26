
function alert(message, alertType) {
    window.ToastReference.zone.run(() => { window.ToastReference.toastShowing(message, alertType); });
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