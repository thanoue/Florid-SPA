
var socket;

function connectSocket(host, connectedCallback) {

    socket = io.connect(host);

    socket.on('connected', (data) => {
        connectedCallback();
        console.log('socket is connected');
    });

    socket.on('printingNoResponse', () => {
        errorToast('Không có thiết bị nào có thể kết nối tới máy in lúc này!');
    });

}

function forceLogoutRegister(callback, notConnectedCallback) {

    if (socket) {
        socket.on('forceLogout', (data) => {
            console.log('force logout ne');
            callback(data.message);
        });
    }
    else {
        if (notConnectedCallback != undefined) notConnectedCallback();
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

function login(userId, isPrinter) {
    if (socket)
        socket.emit('login', { userId: userId, isPrinter: isPrinter });
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

