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
  IonIcon, IonButtons, IonText, IonNote, IonButton, ModalController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, arrowBack, pencil, trash, location, calendar, list } from 'ionicons/icons';
import { DatabaseService } from 'src/app/services/database.service';
import { AddStorePage } from './add-store/add-store.page';

@Component({
  selector: 'app-stores',
  templateUrl: './stores.page.html',
  styleUrls: ['./stores.page.scss'],
  standalone: true,
  imports: [IonButton, 
    CommonModule,
    IonNote, IonText, IonButtons, 
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

  stores = this.db.stores;

  constructor() {
    addIcons({ pencil, trash, add, location, arrowBack, list, calendar });
  }

  ngOnInit() {}

  async addStore() {
    const modal = await this.modalCtrl.create({
      component: AddStorePage
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === "confirm") {
      console.log(data);
    }
  }

  editStore(id: number): void {
    // TODO: navigate to store-details page.
    console.log(id)
  }

  deleteStore(id: number): void {
    // TODO: show confirmation dialog and delete item.
    console.log(id);
  }
}
