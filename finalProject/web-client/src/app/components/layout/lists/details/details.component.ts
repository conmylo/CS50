import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ListService} from "../../../../services/list.service";
import {ToastMessagesService} from "../../../../services/toast-messages.service";

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit{
  listId: any;
  list: any;
  constructor(private activatedRoute: ActivatedRoute,
              public toastService: ToastMessagesService,
              private listService: ListService) {
  }

  async ngOnInit() {
    try {
      this.listId = await this.getListId();
      await this.initList();
    } catch (e: any) {
     this.toastService.toastErrorMessage(e.error.message);
    }
  }

  getListId() {
    return new Promise(resolve => {
      this.activatedRoute.params.subscribe(params => {
        resolve(+params['id']);
      });
    });
  }

  async initList() {
    this.list = await this.listService.fetchListById(this.listId);
  }
}
