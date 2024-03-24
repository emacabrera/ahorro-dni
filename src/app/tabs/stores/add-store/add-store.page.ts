import {
  Component,
  OnInit,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
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
  weekDays: WritableSignal<WeekDays[]>;
  newStoreForm: FormGroup;

  private modalCtrl = inject(ModalController);
  private fb = inject(FormBuilder);
  private util = inject(UtilService);

  constructor() {
    addIcons({ close });
  }

  ngOnInit() {
    this.weekDays = signal(Object.values(WeekDays));
    this.newStoreForm = this.fb.group({
      name: ['', Validators.required],
      address: [''],
      discount: ['', Validators.required],
      days: this.fb.array([], this.util.checkDaysValidation()),
    });

    this.weekDays().forEach(() => this.days.push(this.fb.control(false)));
  }

  get days() {
    return this.newStoreForm.get('days') as FormArray;
  }

  // buildDaysFormControls() {
  //   return this.weekDays().forEach((d) => this.days.push(this.fb.control(false)));
  // }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    console.log(this.newStoreForm.value);
    const formValue = this.newStoreForm.value;
    const store: CreateStore = {
      name: formValue.name,
      address: formValue.address || null,
      discount: formValue.discount,
      days: this.util.selectedOptionsIntoDays(formValue.days)
    }

    console.log(store);
    // return this.modalCtrl.dismiss(this.name, 'confirm');
  }
}
