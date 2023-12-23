import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private http: HttpClient) { }

  async getRequest(endpoint: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get<any>(endpoint).subscribe(response => {resolve(response)}, error => {reject(error)});
    })
  }

  async postRequest(endpoint: string, body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post<any>(endpoint, body).subscribe(response => {resolve(response)}, error => {reject(error)});
    })
  }

  async putRequest(endpoint: string, body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.put<any>(endpoint, body).subscribe(response => {resolve(response)}, error => {reject(error)});
    })
  }

  async deleteRequest(endpoint: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.delete<any>(endpoint).subscribe(response => {resolve(response)}, error => {reject(error)});
    })
  }
}
