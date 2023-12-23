import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {LoadingService} from "../../../services/loading.service";

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})

export class LoadingComponent implements OnInit, OnDestroy {
  isLoading: boolean;
  subscription: Subscription | undefined;
  constructor(private loadingService: LoadingService) {
    this.isLoading = false;
  }

  ngOnInit(): void {
    this.initializeSubscription();
  }

  initializeSubscription = () => {
    this.subscription = this.loadingService.observeLoading().subscribe((status: boolean) => {
      this.isLoading = status;
    });
  }

  ngOnDestroy(): void {
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

