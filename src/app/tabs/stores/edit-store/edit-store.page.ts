import { Component, Input, OnInit, WritableSignal, inject, signal } from '@angular/core';
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
import { UtilService } from 'src/app/services/util.service';
import { WeekDays } from 'src/utils/enumerators';
import { Store } from 'src/app/interfaces/store.model';
import { addIcons } from 'ionicons';
import { close } from 'ionicons/icons';

@Component({
  selector: 'app-edit-store',
  templateUrl: './edit-store.page.html',
  styleUrls: ['./edit-store.page.scss'],
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
export class EditStorePage implements OnInit {
  @Input() store: Store;
  updateStoreForm: FormGroup;
  weekDays: WritableSignal<WeekDays[]>;

  private modalCtrl = inject(ModalController);
  private fb = inject(FormBuilder);
  private util = inject(UtilService);

  constructor() {
    addIcons({ close });
  }

  ngOnInit(): void {
    this.weekDays = signal(Object.values(WeekDays));
    this.updateStoreForm = this.fb.group({
      name: [this.store.name, Validators.required],
      address: [this.store.address || ''],
      discount: [
        this.store.discount,
        [Validators.required, Validators.max(100), Validators.min(1)],
      ],
      notes: [this.store.notes || ''],
      days: this.fb.array(
        this.buildDaysFormControls(),
        this.util.checkDaysValidation()
      ),
    });
    console.log(this.updateStoreForm);
  }

  get days(): FormArray<FormControl<any>> {
    return this.updateStoreForm.get('days') as FormArray;
  }

  cancel(): Promise<boolean> {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  async confirm(): Promise<boolean> {
    const formValue = this.updateStoreForm.value;
    const store: Store = {
      id: this.store.id,
      name: formValue.name,
      address: formValue.address || null,
      discount: formValue.discount,
      notes: formValue.notes,
      days: this.util.selectedOptionsIntoDays(formValue.days),
    };

    return this.modalCtrl.dismiss(store, 'confirm');
  }

  private buildDaysFormControls(): FormControl[] {
    return this.weekDays().map((day) => {
      return this.fb.control(this.store.days.includes(day));
    });
  }
}
