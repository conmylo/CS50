import {Injectable} from '@angular/core';
import {CommonService} from "./common.service";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  currentUser: any = null;

  constructor(private commonService: CommonService) {
  }

  async login(body: any): Promise<string | null> {
    return await this.commonService.postRequest('user/login', body);
  }

  async me(): Promise<any> {
    if (!this.currentUser) {
      this.currentUser = await this.commonService.getRequest('user/me');
    }
    return this.currentUser;
  }

  async fetchAll(): Promise<any> {
    return await this.commonService.getRequest('user');
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return token !== null;
  }

  logout(): void {
    localStorage.clear();
  }

  isAdmin() {
    return this.currentUser.isAdmin;
  }

  async deleteUser(id: number) {
    return await this.commonService.deleteRequest(`user/${id}`);
  }

  async createUser(user: any) {
    return await this.commonService.postRequest('user', user);
  }
}
