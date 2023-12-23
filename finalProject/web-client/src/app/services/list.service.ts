import { Injectable } from '@angular/core';
import {CommonService} from "./common.service";

@Injectable({
  providedIn: 'root'
})
export class ListService {

  constructor(private commonService: CommonService) { }

  async fetchUserLists(): Promise<any> {
    return await this.commonService.getRequest('list')
  }

  async createList(list: any): Promise<any> {
    return await this.commonService.postRequest('list', list);
  }

  async deleteList(id: number) {
    return await this.commonService.deleteRequest(`list/${id}`);
  }

  async updateList(list: any) {
    return await this.commonService.putRequest(`list/${list.id}`, list);
  }

  async fetchListById(listId: any) {
    return await this.commonService.getRequest(`list/${listId}`);
  }
}
