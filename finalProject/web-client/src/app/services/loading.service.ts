import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  loadingSubject: BehaviorSubject<boolean>;

  constructor() {
    this.loadingSubject = new BehaviorSubject<boolean>(false);
  }

  updateLoading(status: boolean): void {
    this.loadingSubject.next(status);
  }

  observeLoading(): Observable<boolean> {
    return this.loadingSubject.asObservable();
  }
}
