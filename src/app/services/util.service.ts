import { Injectable } from '@angular/core';
import { ValidatorFn, AbstractControl, FormArray } from '@angular/forms';
import { WeekDays } from 'src/utils/enumerators';

@Injectable({
  providedIn: 'root',
})
export class UtilService {

  // [false, false, true, true, false, false]
  // [X, J]
  selectedOptionsIntoDays(options: boolean[]): string {
    if (options.length !== 6 || !options.some((o) => o))
      throw Error("invalid array of options");

    const indexes = options
      .map((o, index) => (o ? index : -1))
      .filter((i) => i !== -1);

    return indexes.map((i) => Object.values(WeekDays)[i]).join(', ');
  }
  
  checkDaysValidation(): ValidatorFn {
    const validator: ValidatorFn = (formArray: AbstractControl) => {
      if (formArray instanceof FormArray) {
        const totalSelected = formArray.controls
          .map((control) => control.value)
          .reduce((prev, next) => (next ? prev + next : prev), 0);
        return totalSelected >= 1 ? null : { required: true };
      }

      throw new Error('formArray is not an instance of FormArray');
    };

    return validator;
  }

  toDbString(value: string | null): string | null {
    if (!value) return null;

    return `'${value}'`;
  }
}
