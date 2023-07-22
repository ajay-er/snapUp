import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class RegisterValidators {
  static match(controlName: string, mathingControlName: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const control = group.get(controlName);
      const mathingControl = group.get(mathingControlName);

      if (!control || !mathingControl) {
        return { controlNotFund: false };
      }

      const error =
        control.value === mathingControl.value ? null : { noMatch: true };
      
      mathingControl.setErrors(error)
      
      return error;
    };
  }
}
