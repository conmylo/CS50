import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {LoadingService} from "../../services/loading.service";
import {ToastMessagesService} from "../../services/toast-messages.service";
import {UserService} from "../../services/user.service";
interface LoginUser {
  username: string;
  password: string;
}


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  user: LoginUser;
  constructor(public router: Router,
              private loadingService: LoadingService,
              private userService: UserService,
              private toastService: ToastMessagesService) {
    this.user = {
      username: '',
      password: ''
    }
  }

  ngOnInit() {
    this.checkUserStatus();
  }

  private async checkUserStatus(): Promise<void> {
    if(this.userService.isLoggedIn()) {
      console.log('navigating home');
      await this.navigateToHome();
    }
  }

  async navigateToRegister() {
    await this.router.navigate(['register']);
  }

  async login(): Promise<void> {
    this.loadingService.updateLoading(true);
    try {
      const token = await this.userService.login(this.user);
      if(token) {
        localStorage.setItem('token', token);
        await this.navigateToHome()
      } else {
        this.toastService.toastErrorMessage('Something went wrong');
      }
    } catch (e: any) {
      this.toastService.toastErrorMessage(e.error.message);
    } finally {
      this.loadingService.updateLoading(false);
    }
  }

  async navigateToHome(): Promise<void> {
    await this.router.navigate(['layout'])
  }
}
