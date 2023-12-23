import {Component, OnInit} from '@angular/core';
import {LoadingService} from "../../../services/loading.service";
import {ToastMessagesService} from "../../../services/toast-messages.service";
import {Router} from "@angular/router";
import {UserService} from "../../../services/user.service";
import {MatTableDataSource} from "@angular/material/table";
import {ListService} from "../../../services/list.service";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmDialogComponent} from "../../shared/confirm-dialog/confirm-dialog.component";

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss']
})
export class ListsComponent implements OnInit {
  user: any
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  list: any = {
    title: ''
  }
  selectedListRecord = null;
  columns: any = [];
  constructor(private loadingService: LoadingService,
              public dialog: MatDialog,
              private toastService: ToastMessagesService,
              private listService: ListService,
              private userService: UserService,
              public router: Router) {
  }

  async ngOnInit() {
    try {
      this.loadingService.updateLoading(true);
      await this.initUser();
      this.columns = this.user.isAdmin ? ['id', 'title', 'createdAt', 'user', 'isCompleted',  'actions'] : ['id', 'title', 'createdAt', 'isCompleted', 'actions'];
      await this.fetchLists();
    } catch (e: any) {
      this.toastService.toastErrorMessage(e.error.message);
    } finally {
      this.loadingService.updateLoading(false);
    }
  }

  async initUser() {
      this.user = await this.userService.me();
  }

  async fetchLists(): Promise<any> {
    const lists = await this.listService.fetchUserLists();
    this.dataSource = new MatTableDataSource<any>(lists);
  }

  async createNewList(): Promise<void> {
    try {
      this.loadingService.updateLoading(true);
      await this.listService.createList(this.list);
      this.toastService.toastMessages(`List: ${this.list.title} created successfully`);
      await this.fetchLists();
    } catch (e: any) {
      this.toastService.toastErrorMessage(e.error.message);
    } finally {
      this.loadingService.updateLoading(false);
    }
  }

  editList(record: any) {
    this.selectedListRecord = record;
    this.list.title = record.title;
  }

  deleteList(id: number) {
    const dialog = this.dialog.open(ConfirmDialogComponent, {data: {
      title: 'List Deletion',
        message: "Are you sure you want to delete this list"
      }});

    dialog.afterClosed().subscribe(async (response: any) => {
      if(response) {
        try {
          this.loadingService.updateLoading(true);
          await this.listService.deleteList(id);
          this.toastService.toastMessages('List deleted successfully');
          await this.fetchLists();
        } catch (e: any) {
          this.toastService.toastErrorMessage(e.error.message);
        } finally {
          this.loadingService.updateLoading(false);
        }
      }
    })
  }

  clearListTile(): void {
    this.list.title = '';
    this.selectedListRecord = null;
  }

  updateList(status=0) {
    const dialog = this.dialog.open(ConfirmDialogComponent, {data: {
        title: 'Update List',
        message: "Are you sure you want to update this list"
      }});

    dialog.afterClosed().subscribe(async (response: any) => {
      if(response) {
        try {
          this.loadingService.updateLoading(true);
          // @ts-ignore
          this.list.id = this.selectedListRecord.id;
          this.list.isCompleted = status;
          await this.listService.updateList(this.list);
          this.toastService.toastMessages('List updated successfully');
          await this.fetchLists();
          this.clearListTile();
        } catch (e: any) {
          this.toastService.toastErrorMessage(e.error.message);
        } finally {
          this.loadingService.updateLoading(false);
        }
      }
    })
  }

  async preview(id: number) {
    await this.router.navigate([`/layout/lists/details/${id}`]);
  }

  updateListCheck(element: any) {
      this.selectedListRecord = element;
      this.list.title = element.title;
      this.list.isCompleted = 1;
      this.updateList(1);
  }
}
