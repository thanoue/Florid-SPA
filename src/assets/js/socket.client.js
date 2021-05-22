
var socket = undefined;

function connectSocket(host, connectedCallback, forceLogout) {

    if (socket != undefined)
        return;

    socket = io.connect(host);

    socket.on('connected', (data) => {
        connectedCallback();
    });

    socket.on('printingNoResponse', () => {
        errorToast('Không có thiết bị nào có thể kết nối tới máy in lúc này!');
    });

    socket.on('forceLogout', (data) => {
        forceLogout(data.message);
    });
}

function forceAccountLogout(userId) {
    if (socket) {
        socket.emit('forceAccountLogout', { userId: userId });
    }
}

function disConnectSocket() {

    if (socket) {

        socket.disconnect();
        socket.off('connected');
        socket.off('printingNoResponse');
        socket.off('doPrintJob');

        socket = undefined;
    }
}

function login(userId, isPrinter, role) {
    if (socket)
        socket.emit('login', { userId: userId, isPrinter: isPrinter, role: role });
}

function registerPrintEvent(callback) {

    if (socket) {
        socket.on('doPrintJob', (data) => {
            callback(data.printJob);
        });
    }
}

function invokePrintJob(data) {
    if (socket) {
        socket.emit('doPrintJob', { printJob: data });
    }
}

