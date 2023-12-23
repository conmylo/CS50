import {Component, Input, OnInit} from '@angular/core';
import {LoadingService} from "../../../services/loading.service";
import {ToastMessagesService} from "../../../services/toast-messages.service";
import {ItemService} from "../../../services/item.service";
import {MatTableDataSource} from "@angular/material/table";
import {ConfirmDialogComponent} from "../../shared/confirm-dialog/confirm-dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit {
  @Input() listId: number | undefined;
  item: any = {
    description: '',
    listId: null,
  }
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  selectedItemRecord = null;
  columns = ['id', 'description', 'addedAt', 'isCompleted', 'actions'];

  constructor(private loadingService: LoadingService,
              private toastService: ToastMessagesService,
              private itemsService: ItemService,
              public dialog: MatDialog
  ) {
  }

  async ngOnInit() {
    try {
      this.loadingService.updateLoading(true);
      await this.fetchItems();
    } catch (e: any) {
      this.toastService.toastErrorMessage(e.error.message);
    } finally {
      this.loadingService.updateLoading(false);
    }
  }

  async fetchItems(): Promise<void> {
    const items = await this.itemsService.fetchItems(this.listId);
    this.dataSource = new MatTableDataSource<any>(items);
  }

  editItem(record: any, status=0) {
    this.selectedItemRecord = record;
    this.item.description = record.description;
  }

  deleteItem(id: number) {
    const dialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Item Deletion',
        message: "Are you sure you want to delete this item?"
      }
    });

    dialog.afterClosed().subscribe(async (response: any) => {
      if (response) {
        try {
          this.loadingService.updateLoading(true);
          await this.itemsService.deleteItem(id, {listId: this.listId});
          this.toastService.toastMessages('Item deleted successfully');
          await this.fetchItems();
        } catch (e: any) {
          this.toastService.toastErrorMessage(e.error.message);
        } finally {
          this.loadingService.updateLoading(false);
        }
      }
    })
  }

  updateItem(status=0) {
    const dialog = this.dialog.open(ConfirmDialogComponent, {data: {
        title: 'Update Item',
        message: "Are you sure you want to update this item?"
      }});

    dialog.afterClosed().subscribe(async (response: any) => {
      if(response) {
        try {
          this.loadingService.updateLoading(true);
          // @ts-ignore
          this.item.id = this.selectedItemRecord.id;
          this.item.isCompleted = status;
          console.log(this.item);
          await this.itemsService.updateItem(this.item);
          this.toastService.toastMessages('List updated successfully');
          await this.fetchItems();
          this.clearItemDescription();
        } catch (e: any) {
          this.toastService.toastErrorMessage(e.error.message);
        } finally {
          this.loadingService.updateLoading(false);
        }
      }
    })
  }

  clearItemDescription() {
    this.item.description = '';
    this.selectedItemRecord = null;
  }

  async createNewItem(): Promise<void> {
    try {
      this.loadingService.updateLoading(true);
      // @ts-ignore
      this.item.listId = this.listId;
      await this.itemsService.createItem(this.item);
      this.toastService.toastMessages(`Item ${this.item.description} added successfully`);
      await this.fetchItems();
      this.clearItemDescription();
    } catch (e: any) {
      this.toastService.toastErrorMessage(e.error.message);
    } finally {
      this.loadingService.updateLoading(false);
    }
  }

  async updateItemCheck(element: any) {
    this.selectedItemRecord = element;
    this.item.description = element.description;
    this.updateItem(1);
  }
}
