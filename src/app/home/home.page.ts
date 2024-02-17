import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonNote,
} from '@ionic/angular/standalone';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonNote,
    IonLabel,
    IonItem,
    IonList,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    NgFor,
  ],
})
export class HomePage implements OnInit {
  stores = this.dbService.stores;

  constructor(private dbService: DatabaseService) {}

  ngOnInit(): void {
    // this.dbService.addStore({id: 0, name: 'Ananda', days: 'Wed, Thus' })
  }
}
