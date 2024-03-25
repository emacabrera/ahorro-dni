import {
  Component,
  OnInit,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ModalController,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonButton,
  IonContent,
  IonItem,
  IonInput,
  IonGrid,
  IonList,
  IonCheckbox,
  IonAvatar,
  IonCardTitle,
  IonCardHeader,
  IonCard,
  IonCardContent,
  IonListHeader,
  IonLabel,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { close } from 'ionicons/icons';
import { WeekDays } from 'src/utils/enumerators';
import { CreateStore, Store } from 'src/app/interfaces/store.model';
import { UtilService } from 'src/app/services/util.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-add-store',
  templateUrl: './add-store.page.html',
  styleUrls: ['./add-store.page.scss'],
  standalone: true,
  imports: [
    IonLabel,
    IonListHeader,
    IonCardContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonAvatar,
    IonCheckbox,
    IonList,
    IonGrid,
    IonItem,
    IonContent,
    IonButton,
    IonTitle,
    IonButtons,
    IonToolbar,
    IonHeader,
    IonInput,
    IonIcon,
    CommonModule,
    ReactiveFormsModule,
  ],
})
export class AddStorePage implements OnInit {
  newStoreForm: FormGroup;
  weekDays: WritableSignal<WeekDays[]>;

  private modalCtrl = inject(ModalController);
  private fb = inject(FormBuilder);
  private util = inject(UtilService);

  constructor() {
    addIcons({ close });
  }

  ngOnInit(): void {
    this.weekDays = signal(Object.values(WeekDays));
    this.newStoreForm = this.fb.group({
      name: ['', Validators.required],
      address: [''],
      discount: [
        '',
        [Validators.required, Validators.max(100), Validators.min(1)],
      ],
      days: this.fb.array(
        this.buildDaysFormControls(),
        this.util.checkDaysValidation()
      ),
    });
  }

  get days(): FormArray<FormControl<any>> {
    return this.newStoreForm.get('days') as FormArray;
  }

  cancel(): Promise<boolean> {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  async confirm(): Promise<boolean> {
    const formValue = this.newStoreForm.value;
    const store: CreateStore = {
      name: formValue.name,
      address: formValue.address || null,
      discount: formValue.discount,
      days: this.util.selectedOptionsIntoDays(formValue.days),
    };

    return this.modalCtrl.dismiss(store, 'confirm');
  }

  private buildDaysFormControls(): FormControl[] {
    return this.weekDays().map(() => {
      return this.fb.control(false);
    });
  }
}
