import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';
import { JeepSqlite } from 'jeep-sqlite/dist/components/jeep-sqlite';

window.addEventListener('DOMContentLoaded', async () => {
  try {
    const platform = Capacitor.getPlatform();

    if (platform == 'web') {
      const sqlite = new SQLiteConnection(CapacitorSQLite);
      customElements.define('jeep-sqlite', JeepSqlite);
      const jeepSqliteEl = document.createElement('jeep-sqlite');
      document.body.appendChild(jeepSqliteEl);
      await customElements.whenDefined('jeep-sqlite');
      // console.log('after customElements.whenDefined');

      await sqlite.initWebStore();
      // console.log('after initWebStore');
    }

    bootstrapApplication(AppComponent, {
      providers: [
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        provideIonicAngular(),
        provideRouter(routes),
      ],
    });
  } catch (error) {
    console.error('FATAL ERROR!', error);
  }
});

if (environment.production) {
  enableProdMode();
}
