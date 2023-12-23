import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {LoadingService} from "../../../services/loading.service";
import {ToastMessagesService} from "../../../services/toast-messages.service";
import {UserService} from "../../../services/user.service";
import {ConfirmDialogComponent} from "../../shared/confirm-dialog/confirm-dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit{
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  columns = ['id', 'username', 'email', 'createdAt', 'role', 'actions'];
  constructor(private loadingService: LoadingService,
              public dialog: MatDialog,
              private toastService: ToastMessagesService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.fetchUsers();
  }

  async fetchUsers(): Promise<void> {
    try {
      this.loadingService.updateLoading(true);
      const users = await this.userService.fetchAll();
      this.dataSource = new MatTableDataSource<any>(users);
    } catch (e: any) {
      this.toastService.toastErrorMessage(e.error.message);
    } finally {
      this.loadingService.updateLoading(false);
    }
  }

  deleteUser(id: number) {
    const dialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'User Deletion',
        message: "Are you sure you want to delete this user?"
      }
    });

    dialog.afterClosed().subscribe(async (response: any) => {
      if (response) {
        try {
          this.loadingService.updateLoading(true);
          await this.userService.deleteUser(id);
          this.toastService.toastMessages('User deleted successfully');
          await this.fetchUsers();
        } catch (e: any) {
          this.toastService.toastErrorMessage(e.error.message);
        } finally {
          this.loadingService.updateLoading(false);
        }
      }
    })
  }
}
