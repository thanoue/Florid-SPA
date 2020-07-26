import { MenuItems } from '../enums';

export class PageComponent {
    Title: string;
    Menu: MenuItems;
    constructor(title: string, menu: MenuItems) {
        this.Title = title;
        this.Menu = menu;
    }
}