import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  Signal,
  ViewChild,
  inject,
} from '@angular/core';
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
import { AlertController } from '@ionic/angular';
import { ToastService } from 'src/app/services/toast.service';
import { Store } from 'src/app/interfaces/store.model';
import { EditStorePage } from './edit-store/edit-store.page';

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
  stores: Signal<Store[]>;
  @ViewChild('slidingItems') slidingItems: IonItemSliding;

  private db = inject(DatabaseService);
  private modalCtrl = inject(ModalController);
  private alertCtrl = inject(AlertController);
  private toastService = inject(ToastService);

  constructor() {
    addIcons({
      pencil,
      trash,
      add,
      location,
      arrowBack,
      list,
      calendar,
      thumbsUp,
    });
  }

  ngOnInit(): void {
    this.stores = this.db.stores;
  }

  async addStore(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: AddStorePage,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role == 'cancel' || !data) return;

    try {
      await this.db.addStore(data);
      await this.toastService.showSuccessMessage(
        'Negocio agregado a tu lista!'
      );
    } catch (_) {
      await this.toastService.showErrorMessage();
    }
  }

  async editStore(store: Store): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: EditStorePage,
      componentProps: { store: store }
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role == 'cancel' || !data) {
      this.slidingItems.close();
      return;
    };

    try {
      await this.db.updateStore(data);

      await this.toastService.showSuccessMessage(
        'Datos del negocio actualizados!'
      );
    } catch (_) {
      await this.toastService.showErrorMessage();
    }
  }

  async deleteStore(id: number): Promise<void> {
    if (!id) return;

    const alert = await this.alertCtrl.create({
      header: 'Borrar Negocio',
      message: 'Seguro que querés borrar este negocio?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            this.slidingItems.closeOpened();
          },
        },
        {
          text: 'Aceptar',
          role: 'confirm',
          cssClass: 'alert-button-confirm',
          handler: () => {
            this.handleDeleteStore(id);
          },
        },
      ],
    });

    await alert.present();
  }

  private async handleDeleteStore(id: number): Promise<void> {
    try {
      await this.db.deleteStoreById(id);
      await this.toastService.showSuccessMessage(
        'Negocio quitado de tu lista!'
      );
    } catch (_) {
      await this.toastService.showErrorMessage();
    }
  }
}
