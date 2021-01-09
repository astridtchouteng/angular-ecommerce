import { FormControl, ValidationErrors } from "@angular/forms";

export class ShopValidator {

    static notOnlyWhiteSpace(formControl: FormControl): ValidationErrors {

        // formmControl is not null and value only contains white space
        if(formControl.value != null && formControl.value.trim().length === 0) {
            //return error object
            return {'notOnlyWhiteSpace' : true};
        }

        return null;
    }
}
