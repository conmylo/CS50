import { TestBed } from '@angular/core/testing';

import { ToastMessagesService } from './toast-messages.service';

describe('ToastMessagesService', () => {
  let service: ToastMessagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastMessagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
