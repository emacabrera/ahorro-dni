import { Injectable, WritableSignal, computed, signal } from '@angular/core';
import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection,
} from '@capacitor-community/sqlite';
import { Store } from '../interfaces/store.model';
import { WeekDays } from 'src/utils/enumerators';

const DB_NAME = 'cuenta-dni-dic-db';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private db!: SQLiteDBConnection;
  private _stores: WritableSignal<Store[]> = signal<Store[]>([]);

  constructor() {}

  async initPlugin(): Promise<void> {
    this.db = await this.sqlite.createConnection(
      DB_NAME,
      false,
      'no-encryption',
      1,
      false
    );

    await this.db.open();

    const query = `DROP TABLE IF EXISTS store`;

    await this.db.execute(query);

    const schemaQuery = `CREATE TABLE IF NOT EXISTS store (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT UNIQUE NOT NULL,
			days TEXT NOT NULL,
			address TEXT NULL
		)`;

    await this.db.execute(schemaQuery);
    this.loadStores();
  }

  get stores() {
    return computed(this._stores);
  }

  async addStore(store: Store) {
    const query = `INSERT INTO store (name, days) VALUES ('${store.name}', '${store.days}')`;
    const result = await this.db.query(query);

    this.loadStores();

    return result;
  }

  async updateStoreById(store: Store) {
    const query = `UPDATE store SET name='${store.name}' WHERE id=${store.id}`;
    const result = await this.db.query(query);

    this.loadStores();

    return result;
  }

  async deleteStoreById(id: number) {
    const query = `DELETE FROM store WHERE id=${id}`;
    const result = await this.db.query(query);

    this.loadStores();

    return result;
  }

  async seedDatabase() {
    const query = `INSERT OR IGNORE INTO store (name, days, address) VALUES
			(
				'Ananda', '${WeekDays.Wednesday}, ${WeekDays.Thursday}',
				'Av. Meeks 1067, Temperley'
			)`;
    const result = this.db.query(query);

    this.loadStores();

    return result;
  }

  private async loadStores() {
    const stores = await this.db.query('SELECT * FROM store');
    this._stores.set(stores.values || []);
  }
}
