import {
  Injectable,
  Signal,
  WritableSignal,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection,
} from '@capacitor-community/sqlite';
import { CreateStore, Store } from '../interfaces/store.model';
import { WeekDays } from 'src/utils/enumerators';
import { UtilService } from './util.service';

const DB_NAME = 'cuenta-dni-dic-db';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private db!: SQLiteDBConnection;
  private _stores: WritableSignal<Store[]> = signal<Store[]>([]);

  private util = inject(UtilService);

  constructor() {}

  get stores(): Signal<Store[]> {
    return computed(this._stores);
  }

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
      address TEXT NULL,
      discount INTEGER NOT NULL,
      notes TEXT NULL,
			days TEXT NOT NULL
		)`;

    await this.db.execute(schemaQuery);
    this.loadStores();
  }

  async addStore(store: CreateStore): Promise<void> {
    const query = `INSERT INTO store (name, address, discount, days) 
      VALUES ('${store.name}', ${this.util.toDbString(store.address)}, ${
      store.discount
    }, '${store.days}')`;
    await this.db.query(query);

    this.loadStores();
  }

  async updateStore(store: Store): Promise<void> {
    const query = `UPDATE store SET 
      name='${store.name}',
      address = '${store.address}',
      discount = ${store.discount},
      notes = '${store.notes}',
      days = '${store.days}'
      WHERE id=${store.id}`;
    await this.db.query(query);

    this.loadStores();
  }

  async deleteStoreById(id: number): Promise<void> {
    const query = `DELETE FROM store WHERE id=${id}`;
    await this.db.query(query);

    this.loadStores();
  }

  async seedDatabase(): Promise<void> {
    const query = `INSERT OR IGNORE INTO store (name, address, discount, days)
      VALUES (
        'Ananda',
        'Av. Meeks 1067, Temperley',
        30,
        '${WeekDays.Wednesday}, ${WeekDays.Thursday}'
      )`;
    await this.db.query(query);

    this.loadStores();
  }

  private async loadStores() {
    const stores = await this.db.query('SELECT * FROM store');
    this._stores.set(stores.values || []);
  }
}
