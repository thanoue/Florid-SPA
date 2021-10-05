import { Injectable } from '@angular/core';
import { BaseService } from './common/base.service';
import { Tag } from '../models/entities/tag.entity';
import { GlobalService } from './common/global.service';
import { StorageService } from './storage.service';
import { HttpService } from './common/http.service';
import { API_END_POINT } from '../app.constants';

@Injectable({
  providedIn: 'root'
})
export class TagService {

  constructor(private htttService: HttpService, private globalService: GlobalService) {
  }

  bulkAdd(tags: Tag[]): Promise<any> {

    const obj = [];

    tags.forEach(tag => {
      obj.push({
        Alias: tag.Alias,
        Name: tag.Name
      });
    });

    return this.htttService.post(API_END_POINT.bulkAddTags, tags)
      .then((data) => {
        return data;
      }).catch(err => {
        this.htttService.handleError(err);
        throw err;
      });
  }

  addBulkProductTag(ids: any[]): Promise<any> {
    return this.htttService.post(API_END_POINT.bulkAddProductsTags, ids)
      .then((data) => {
        return data;
      }).catch(err => {
        this.htttService.handleError(err);
        throw err;
      });
  }

  getAll(): Promise<Tag[]> {
    return this.htttService.get(API_END_POINT.getAllTags)
      .then(datas => {
        const tags: Tag[] = [];

        datas.forEach(rawTag => {

          const tag = new Tag();

          tag.Id = rawTag.Id;
          tag.Description = rawTag.Description;
          tag.Name = rawTag.Name;
          tag.Alias = rawTag.Alias;

          tags.push(tag);
        });

        return tags;
      })
      .catch(err => {
        this.htttService.handleError(err);
        throw err;
      });
  }

  createTag(tag: Tag): Promise<Tag> {

    return this.htttService.post(API_END_POINT.createTag, {
      alias: tag.Alias,
      name: tag.Name,
      description: tag.Description
    }).then((res) => {

      // tslint:disable-next-line:no-shadowed-variable
      const tag = new Tag();
      tag.Id = res.tag.Id;
      tag.Description = res.tag.Description;
      tag.Name = res.tag.Name;

      return tag;

    }).catch(err => {
      this.htttService.handleError(err);
      throw tag;
    });
  }

  updateTag(tag: Tag): Promise<any> {

    return this.htttService.post(API_END_POINT.updateTag, {
      alias: tag.Alias,
      name: tag.Name,
      description: tag.Description,
      id: tag.Id
    }).then((res) => {

      return res;

    }).catch(err => {
      this.htttService.handleError(err);
    });
  }


  deleteTag(id: number): Promise<any> {
    return this.htttService.post(API_END_POINT.deleteTag, {
      id
    }).then((res) => {
      return res;
    }).catch(err => {
      this.htttService.handleError(err);
    });
  }

  deleteTags(ids: number[]): Promise<any> {
    return this.htttService.post(API_END_POINT.deleteTags, {
      tagIds: ids
    }).then((res) => {
      return res;
    }).catch(err => {
      this.htttService.handleError(err);
    });
  }

  getRecords(page: number, itemsPerPage: number, descriptionTerm: string = ''): Promise<{
    tags: Tag[],
    totalItemCount: number,
    totalPages: number
  }> {
    return this.htttService.get(API_END_POINT.getTags, {
      page: page - 1,
      size: itemsPerPage,
      description: descriptionTerm
    }).then(datas => {

      if (!datas) {
        return null;
      }

      const res: any = {};

      res.totalItemCount = +datas.totalItemCount;
      res.totalPages = +datas.totalPages;
      res.tags = [];

      if (datas.items) {

        datas.items.forEach(item => {
          res.tags.push(item);
        });

      }

      return res;

    }).catch(err => {
      this.htttService.handleError(err);
      throw err;
    });

  }

}
