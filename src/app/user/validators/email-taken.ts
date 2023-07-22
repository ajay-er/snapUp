import { Injectable } from "@angular/core";
import { AbstractControl, AsyncValidator, ValidationErrors } from "@angular/forms";
import { AuthService } from "src/app/services/auth.service";

@Injectable()
export class EmailTaken implements AsyncValidator{
    constructor(private auth: AuthService) { }
    
    validate(control: AbstractControl): Promise<ValidationErrors | null> {

        // TODO: check email validation asynchronsly

        //    this.auth.fetchSignInMethodEmail()
        return new Promise(()=>{});
    }

}
