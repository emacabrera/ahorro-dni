import { Injectable, inject } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { sad, thumbsUp } from 'ionicons/icons';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastCtrl = inject(ToastController);

  constructor() {
    addIcons({ sad, thumbsUp });
  }

  async showErrorMessage() {
    const toast = await this.toastCtrl.create({
      message: 'Oops! Algo salió mal, por favor intentalo otra vez.',
      icon: 'sad',
      duration: 4000,
      color: 'danger',
    });
    await toast.present();
  }

  async showSuccessMessage(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      icon: 'thumbs-up',
      duration: 4000,
      color: 'success',
    });
    await toast.present();
  }
}
