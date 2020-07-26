import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { PageComponent } from "../../models/view.models/menu.model";
import { MenuItems } from 'src/app/models/enums';
import { Tag } from 'src/app/models/entities/tag.entity';
import { TagService } from 'src/app/services/tag.service';
import { FunctionsService } from 'src/app/services/common/functions.service';
import { threadId } from 'worker_threads';
import { NgForm } from '@angular/forms';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ExchangeService } from 'src/app/services/exchange.service';
declare function hideAdd(): any;
declare function showTagEditPopup(): any;

@Component({
  selector: 'app-product-tag',
  templateUrl: './product-tag.component.html',
  styleUrls: ['./product-tag.component.css']
})
export class ProductTagComponent extends BaseComponent {

  protected PageCompnent: PageComponent = new PageComponent('Tag Sản Phẩm', MenuItems.ProductTag);

  isSelectAll: boolean = false;
  currentPage = 1;

  tagAlias = '';

  currentTag: Tag;

  tags: {
    Tag: Tag,
    IsChecked: boolean
  }[];

  pageCount = 0;
  itemTotalCount = 0;

  _itemsPerPage: number;

  get itemPerpage(): number {
    return this._itemsPerPage;
  }

  set itemPerpage(val: number) {

    this._itemsPerPage = val;

    this.pageChanged(1);
  }

  constructor(private tagService: TagService) {
    super();
    this.currentTag = new Tag();
  }

  onTagNameChange(tagName: string) {
    this.updateTagAlias();
  }

  updateTagAlias() {

    const str = ExchangeService.getAlias(this.currentTag.Name);
    this.tagAlias = str;
    this.currentTag.Alias = str;
  }

  

  editRequest(tag: Tag) {

    this.currentTag = new Tag();
    this.currentTag.Id = tag.Id;
    this.currentTag.Description = tag.Description;
    this.currentTag.Name = tag.Name;
    this.updateTagAlias();

    showTagEditPopup();
  }

  addTag(form: NgForm) {

    if (!form.valid) {
      return;
    }

    if (!this.currentTag.Id || this.currentTag.Id <= 0) {
      this.tagService.createTag(this.currentTag).then(res => {
        hideAdd();
        this.currentTag = new Tag();
        this.pageChanged(this.currentPage);
      });
    } else {
      this.tagService.updateTag(this.currentTag).then(res => {
        hideAdd();
        this.currentTag = new Tag();
        this.pageChanged(this.currentPage);
      });
    }
  }

  protected Init() {
    this._itemsPerPage = 10;
    this.pageChanged(1);
  }

  pageChanged(page: number) {

    this.currentPage = page;

    this.tagService.getRecords(page, this._itemsPerPage).then(tags => {

      this.tags = [];
      this.itemTotalCount = tags.totalItemCount;
      this.pageCount = tags.totalPages;

      tags.tags.forEach(tag => {
        this.tags.push({
          Tag: tag,
          IsChecked: false
        });
      })
    });
  }

  checkAllChange(isCheck: boolean) {
    this.isSelectAll = isCheck;
    this.tags.forEach(tag => {
      tag.IsChecked = isCheck;
    });
  }

  deleteTags() {

    let tagIds: number[] = [];

    this.tags.forEach(tag => {
      if (tag.IsChecked) {
        tagIds.push(tag.Tag.Id);
      }
    });

    if (tagIds.length <= 0) {
      return;
    }

    this.openConfirm('Chắc chắn xoá các tag sản phẩm?', () => {
      this.tagService.deleteTags(tagIds).then(re => {

        this.pageChanged(this.currentPage);

      });
    });
  }

  deleteTag(tag: Tag) {

    this.openConfirm('Chắc chắn xoá tag sản phẩm?', () => {

      this.tagService.deleteTag(tag.Id).then(re => {

        this.pageChanged(this.currentPage);

      });

    });

  }
}
