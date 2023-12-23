import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ToastMessagesService {

  constructor(public snackBar: MatSnackBar) {
  }

  toastSuccessfulDrop(message: string, action?: any) {
    this.snackBar.open('Το πεδίο προστέθηκε', 'done', {
      duration: 2000,
      horizontalPosition: 'center',
      panelClass: ['mat-simple-snackbar', 'green-snackbar']
    });
  }

  toastMessages(message: string, action?: any) {
    action = action ? action : '';
    this.snackBar.open(message, action, {
      duration: 5000,
      panelClass: ['blue-snackbar']
    });
  }

  toastErrorMessage(message: string) {
    this.snackBar.open(`${message}`, '', {
      duration: 5000,
      panelClass: ['warning-snackbar']
    });
  }
}
