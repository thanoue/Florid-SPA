import { Injectable, EventEmitter } from "@angular/core";
import { GlobalService } from './common/global.service';
const CLIENT_ID = "133667086103-hrctr1jpgcdkj9jsa51khl5vdugn7d99.apps.googleusercontent.com";
const API_KEY = "AIzaSyACbWlpyxwgjaT8Tefm8LSU9H2dWOmKDcU";
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
var SCOPES = 'https://www.googleapis.com/auth/drive';

@Injectable({
  providedIn: 'root'
})
export class GoogleService {

  googleAuth: gapi.auth2.GoogleAuth;

  constructor(private globalResource: GlobalService) { }

  get isSignedIn(): boolean {
    return this.googleAuth.isSignedIn.get();
  }

  signIn(): Promise<gapi.auth2.GoogleUser> {
    return this.googleAuth.signIn({
      prompt: 'consent'
    }).then((googleUser: gapi.auth2.GoogleUser) => {
      return googleUser;
    });
  }

  signOut(): void {
    
    if (this.globalResource.isOnMobile())
      return;

    this.googleAuth.signOut();
  }

  initClient() {
    return new Promise((resolve, reject) => {
      gapi.load('client:auth2', () => {
        return gapi.client.init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES,
        }).then(() => {
          this.googleAuth = gapi.auth2.getAuthInstance();
          resolve();
        });
      });
    });

  }
}
