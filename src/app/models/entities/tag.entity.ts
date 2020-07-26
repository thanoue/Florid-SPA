import { BaseEntity } from './base.entity';

export class Tag {
    Id: number;
    Alias: string;
    Name: string;
    Description: string;
    Index: number;
    createdAt: Date;
    updatedAt: Date;

    constructor() {
    }
}