import {Component, OnInit} from '@angular/core';
import {LoadingService} from "../../services/loading.service";
import {ToastMessagesService} from "../../services/toast-messages.service";
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit{
  user: any = null;
  constructor(private loadingService: LoadingService,
              private toastService: ToastMessagesService,
              private userService: UserService,
              public router: Router) {
  }

  async ngOnInit(): Promise<void> {
    try {
      if(!this.userService.isLoggedIn()) {await this.logout();}
      await this.initUser();
      if (!this.user) { await this.logout(); }
    } catch (e: any) {
      this.toastService.toastErrorMessage(e.error.message);
    }
  }

  public isAdmin(): boolean {
    return this.userService.isAdmin();
  }

  async logout() {
    this.userService.logout();
    await this.router.navigate(['login']);
  }

  async initUser() {
    try {
      this.user = await this.userService.me();
      console.log(this.user);
    } catch (e: any) {
      this.toastService.toastErrorMessage(e.error.message);
    }
  }

  async navigateToUsers() {
    await this.router.navigate(['layout/users']);
  }

  async navigateToHome() {
    await this.router.navigate(['layout']);
  }
}
