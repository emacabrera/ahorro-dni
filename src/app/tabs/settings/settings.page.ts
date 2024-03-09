import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  IonToggle,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonItem,
    IonList,
    IonContent,
    IonTitle,
    IonToolbar,
    IonHeader,
    IonToggle,
  ],
})
export class SettingsPage implements OnInit {
  themeToggle = false;

  constructor() {}

  ngOnInit(): void {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    this.initializeDarkTheme(prefersDark.matches);

    prefersDark.addEventListener('change', (mediaQuery) =>
      this.initializeDarkTheme(mediaQuery.matches)
    );
  }

  initializeDarkTheme(isDark: boolean): void {
    this.themeToggle = isDark;
    this.toggleDarkTheme(isDark);
  }

  // Listen for the toggle check/uncheck to toggle the dark theme
  toggleChange(event: any): void {
    this.toggleDarkTheme(event.detail.checked);
  }

  // Add or remove the "dark" class on the document body
  toggleDarkTheme(shouldAdd: boolean): void {
    document.body.classList.toggle('dark', shouldAdd);
  }
}
