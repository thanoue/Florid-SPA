export class BaseEntity {
    Id: string;
    Active: boolean;
    Created: number;
    IsDeleted = false;

    constructor() {
        this.Created = (new Date()).getTime();
    }
}
