import { Directive, Input } from '@angular/core';
import { AbstractControl, ValidatorFn, NG_VALIDATORS } from '@angular/forms';
import { FileType } from '../dashboard-page/dashboard-page.component';

/** A hero's name can't match the given regular expression */
export function forbiddenNameValidator(currentLocationFiles: Array<any>, currentName: string): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    console.log(currentLocationFiles)
    
    let sameName = false;

    currentLocationFiles.forEach((v) => {
      if(v.name == control.value && control.value != currentName){
        sameName = true ;
      }
    })

    return sameName  ?{'forbiddenNameValidator': {value: control.value}} : null;
    // names.forEach((name) => {
    //   if(name == control.value)
    //     return {'forbiddenName': {value: control.value}};
    // })
    // return null;
  };
}

@Directive({
  selector: '[appDuplicateName]',
  providers: [{provide: NG_VALIDATORS, useExisting: DuplicateNameDirective, multi: true}]
})
export class DuplicateNameDirective {

  @Input('appForbiddenName') forbiddenName: Array<string> ;

  validate(control: AbstractControl): {[key: string]: any} | null {

    let sameName ;

    // this.forbiddenName.forEach(name => {
    //   //if name same, then return name.
    //   if((sameName = forbiddenNameValidator(new RegExp(name, 'i'))(control)) != null){
    //     return name;
    //   }
    // });

    //for loop finish, no same name.
    return null;
  }

}
