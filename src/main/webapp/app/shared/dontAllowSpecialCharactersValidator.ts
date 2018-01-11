import {
    ReactiveFormsModule,
    NG_VALIDATORS,
    FormsModule,
    FormGroup,
    FormControl,
    ValidatorFn,
    Validator
} from '@angular/forms';
import { Directive } from '@angular/core';
@Directive({
    selector: '[nameValidator][ngModel]',
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: NameValidator,
            multi: true
        }
    ]
})
export class NameValidator implements Validator {
    validator: ValidatorFn;
    nameRegEx: RegExp;
    spaceRepRegEx: RegExp;
    constructor() {
        this.validator = this.nameValidator();
        this.nameRegEx = /^[\s\w.-]*$/;
        this.spaceRepRegEx = /^[\s]*$/;
    }
    validate(c: FormControl) {
        return this.validator(c);
    }

    nameValidator(): ValidatorFn {
        return (c: FormControl) => {
            let value = c.value || '';
            let isValid = this.nameRegEx.test(value);
            if (value.replace(this.spaceRepRegEx, '').length === 0) {
                return {
                    emptySpaces: {
                        valid: false
                    }
                };
            } else if (isValid) {
                return null;
            } else {
                return {
                    nameValidator: {
                        valid: false
                    }
                };
            }
        }
    }
}

