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

  constructor() {
    addIcons({ close });
  }

  ngOnInit() {
    this.weekDays = signal(Object.values(WeekDays));
    this.newStoreForm = this.fb.group({
      name: ['', Validators.required],
      address: [''],
      discount: ['', Validators.required],
      days: this.fb.array([], this.checkSelectedDays(1)),
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
    // return this.modalCtrl.dismiss(this.name, 'confirm');
  }

  private checkSelectedDays(min: number): ValidatorFn {
    const validator: ValidatorFn = (formArray: AbstractControl) => {
      if (formArray instanceof FormArray) {
        const totalSelected = formArray.controls
          .map((control) => control.value)
          .reduce((prev, next) => (next ? prev + next : prev), 0);
        return totalSelected >= min ? null : { required: true };
      }

      throw new Error('formArray is not an instance of FormArray');
    };

    return validator;
  }
}
