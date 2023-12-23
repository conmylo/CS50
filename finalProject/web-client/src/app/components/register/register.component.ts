import { Component } from '@angular/core';
import {LoadingService} from "../../services/loading.service";
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";
import {ToastMessagesService} from "../../services/toast-messages.service";
interface RegisterUser {
  username: string;
  password: string;
  email: string;
}
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  user: RegisterUser = {
    username: '',
    email: '',
    password: ''
  }

  constructor(private loadingService: LoadingService,
              private userService: UserService,
              public toastService: ToastMessagesService,
              public router: Router) {
  }

  isFormValid(): boolean {
    if (this.user.username && this.user.password && this.user.email) { return true; } else return false;
  }

  async registerUser() {
    try {
      this.loadingService.updateLoading(true);
      await this.userService.createUser(this.user);
      this.toastService.toastErrorMessage('User created successfully. Please Login');
      await this.router.navigate(['login']);
    } catch (e: any) {
      this.toastService.toastErrorMessage(e.error.message);
    } finally {
      this.loadingService.updateLoading(false);
    }
  }
}
