import { Injectable } from '@angular/core';
import {CommonService} from "./common.service";

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private commonService: CommonService) { }

  async fetchItems(listId: number | undefined) {
    return await this.commonService.getRequest(`item/${listId}`)
  }

  async createItem(item: {description: string, listId: any}) {
    return await this.commonService.postRequest('item', item);
  }

  async deleteItem(id: number, body: any) {
    return await this.commonService.putRequest(`item/delete/${id}`, body);
  }

  async updateItem(item: any) {
    return await this.commonService.putRequest(`item/${item.id}`, item);
  }
}
