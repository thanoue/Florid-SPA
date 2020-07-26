const admin = require('firebase-admin');
const serviceAccount = require('../../serviceAccountKey.json');


const defaultApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://lorid-e9c34.firebaseio.com"
});

export const momoConfig = {
    secretKey: 'gPefAYXMR3jQQ44bBU4oRjIzOC6Awsa0',
    partnerCode: 'MOMO6B4T20200319',
    storeId: 'florid_1',
    accessKey: 'kcWTrI6rGUHxnFlq',
    publicKey: 'MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAqxVXfFBhTYk6kOYbdPK9jx5ZH7Im5PR0g6JWhrmPbFo1mQE/vgM0uc2MH6VF/fuxQUOGFmtNnBNyZgnWYWHUCL4/fYql0AdtvwFYrSnVwbJXdyhrYSrMD1uOIgVORn1h/9WlkHKIn40YT5c/3p7GDofqwX65HanLGKDb9FJRXPtoo0yv0OVRQxL1QVvkXpQMa2ZK8mSBz04wYNw5LPvtXKEoTQTjcVSK1+JWsltaF9qOvIK4GiuqnY17uFoVcBD7cutyim4HxG7j97/ac4s0zP/48wlPNsn6vCc20XrtIhb3iGMxPrxMiQUhzvgnPcQ81a4OcUUTFMcXUTmeOYQwn8Rq/p0rQJcADyif267h/HvaJNxtowdesdxlBSlAd0JyalG8Y+7FxwsWu0YiX5PQhedJuUjj1CW86DwIM8FH9NDjvCRoo4f/Ap5F7DpJtwywrqi7nkUsD9U8EOLggk6+X5D8LsODnbuuLnpZDz281goH52ovsZhujN2SE3ErXaXF7YPvRxPVMd+m4VYW+fGtK5JU4rfFkux+W5WId7EaWxNdP0E5eMcMQhnbuBZQAvFG+KxN11GKc7RHtJM+9hBfBvMRiL7MtXDrbLOiipBigRXyxBX85zwuepi7YQAhDeuktQI9bpEB+R+xU7PZHMdXZ5b/zNnB8dc/pE+7ZFmFWSkCAwEAAQ=='
};

export const firebaseConfig = {
    apiKey: 'AIzaSyDZGFKjLZH4h0SCRdmJVAP0QsRxo_9qYwA',
    authDomain: 'lorid-e9c34.firebaseapp.com',
    databaseURL: 'https://lorid-e9c34.firebaseio.com',
    projectId: 'lorid-e9c34',
    storageBucket: 'lorid-e9c34.appspot.com',
    messagingSenderId: '907493762076',
    appId: '1:907493762076:web:41a83454c12029c3c6abd9',
    measurementId: 'G-DMM406R71M'
}

export const OAuthPrivateKey = "KHOIDEPTRAIAHIIH";
export const defaultAuth = defaultApp.auth();
export const defauDatabase = defaultApp.database();
export const messaging = defaultApp.messaging();
