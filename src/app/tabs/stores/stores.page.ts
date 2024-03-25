import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonLabel,
  IonItem,
  IonItemSliding,
  IonAvatar,
  IonItemOptions,
  IonItemOption,
  IonIcon,
  IonButtons,
  IonText,
  IonNote,
  IonButton,
  ModalController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  add,
  arrowBack,
  pencil,
  trash,
  location,
  calendar,
  list,
  thumbsUp,
} from 'ionicons/icons';
import { DatabaseService } from 'src/app/services/database.service';
import { AddStorePage } from './add-store/add-store.page';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-stores',
  templateUrl: './stores.page.html',
  styleUrls: ['./stores.page.scss'],
  standalone: true,
  imports: [
    IonButton,
    CommonModule,
    IonNote,
    IonText,
    IonButtons,
    IonIcon,
    IonItemOption,
    IonItemOptions,
    IonAvatar,
    IonItemSliding,
    IonItem,
    IonLabel,
    IonList,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
  ],
})
export class StoresPage implements OnInit {
  private db = inject(DatabaseService);
  private modalCtrl = inject(ModalController);
  private alertCtrl = inject(AlertController);
  private toastCtrl = inject(ToastController);

  stores = this.db.stores;

  constructor() {
    addIcons({
      pencil,
      trash,
      add,
      location,
      arrowBack,
      list,
      calendar,
      thumbsUp
    });
  }

  ngOnInit() {}

  async addStore() {
    const modal = await this.modalCtrl.create({
      component: AddStorePage,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role == 'cancel' || !data) return;

    try {
      await this.db.addStore(data);
      const toast = await this.toastCtrl.create({
        message: 'Negocio agregado a tu lista!',
        icon: 'thumbs-up',
        color: 'success',
        duration: 3000,
      });

      await toast.present();
    } catch (_) {
      const toast = await this.toastCtrl.create({
        message: 'Hubo un error. Por favor intentalo otra vez.',
        icon: 'sad',
        color: 'danger',
        duration: 3500,
      });

      await toast.present();
    }
  }

  editStore(id: number): void {
    // TODO: navigate to store-details page.
    console.log(id);
  }

  async deleteStore(id: number) {
    if (!id) return;

    const alert = await this.alertCtrl.create({
      header: 'Borrar Negocio',
      message: 'Seguro que querés borrar este negocio?',
      buttons: [
        {
          text: 'Aceptar',
          role: 'confirm',
          handler: () => {
            this.handleDeleteStore(id);
          },
        },
        {
          text: 'Cancelar',
          role: 'cancel',
        },
      ],
    });

    await alert.present();
  }

  private async handleDeleteStore(id: number) {
    try {
      await this.db.deleteStoreById(id)

      const toast = await this.toastCtrl.create({
        message: 'Negocio quitado de tu lista!',
        icon: 'thumbs-up',
        color: 'success',
        duration: 3000,
      });
      toast.present();
    } catch (_) {
      // show error toast
    }
  }
}
