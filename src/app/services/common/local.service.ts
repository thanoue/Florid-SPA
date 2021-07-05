import { LOCAL_STORAGE_VARIABLE } from '../../app.constants';
import { Roles } from 'src/app/models/enums';
import { Config } from 'src/app/models/entities/config.entity';

export class LocalService {

    static getItem(key: string) {
        return localStorage.getItem(key);
    }

    static setItem(key: string, value: any) {
        return localStorage.setItem(key, value);
    }

    static removeItem(key: string) {
        return localStorage.removeItem(key);
    }

    static clear() {
        localStorage.clear();
    }

    static logout() {
        LocalService.clear();
    }

    static getUserId() {
        return parseInt(LocalService.getItem(LOCAL_STORAGE_VARIABLE.user_id));
    }

    static setUserId(id: any) {
        LocalService.setItem(LOCAL_STORAGE_VARIABLE.user_id, id);
    }

    static getRole(): string {
        // tslint:disable-next-line:radix
        return LocalService.getItem(LOCAL_STORAGE_VARIABLE.role);
    }
    static setRole(role: string) {
        LocalService.setItem(LOCAL_STORAGE_VARIABLE.role, role);
    }

    static setUserName(name: string) {
        LocalService.setItem(LOCAL_STORAGE_VARIABLE.user_name, name);
    }
    static getUserName() {
        return LocalService.getItem(LOCAL_STORAGE_VARIABLE.user_name);
    }

    static getApiAccessToken() {
        return LocalService.getItem(LOCAL_STORAGE_VARIABLE.api_access_token);
    }

    static setApiAccessToken(token: string) {
        LocalService.setItem(LOCAL_STORAGE_VARIABLE.api_access_token, token);
    }

    static getUserAvtUrl() {
        return LocalService.getItem(LOCAL_STORAGE_VARIABLE.user_avt_url);
    }

    static setUserAvtUrl(url: string) {
        LocalService.setItem(LOCAL_STORAGE_VARIABLE.user_avt_url, url);
    }

    static getUserEmail() {
        return LocalService.getItem(LOCAL_STORAGE_VARIABLE.user_email);
    }

    static setUserEmail(email: string) {
        LocalService.setItem(LOCAL_STORAGE_VARIABLE.user_email, email);
    }

    static getPhoneNumber() {
        return LocalService.getItem(LOCAL_STORAGE_VARIABLE.phone_number);
    }

    static setPhoneNumber(phoneNumber: string) {
        LocalService.setItem(LOCAL_STORAGE_VARIABLE.phone_number, phoneNumber);
    }

    static setConfig(config: Config) {
        LocalService.setItem(LOCAL_STORAGE_VARIABLE.config, JSON.stringify(config));
    }

    static getConfig(): Config {

        let val = LocalService.getItem(LOCAL_STORAGE_VARIABLE.config);

        if (val && val != null) {
            return JSON.parse(val);
        }

        return new Config();
    }
}




