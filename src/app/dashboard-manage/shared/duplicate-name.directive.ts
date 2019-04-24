import { Directive, Input } from '@angular/core';
import { AbstractControl, ValidatorFn, NG_VALIDATORS } from '@angular/forms';

export function forbiddenNameValidator(currentLocationFiles: Array<any>, currenId: string, type: string): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    
    
    let currentSame = false;

    let sameNum = 0;

    let sameName = false;

    currentLocationFiles.forEach((v) => {
      if(v.name == control.value &&  v.type == type){
        sameNum ++;
        if(currenId == v.id){
          currentSame = true;
        }
      }
      
        
    })

    if(sameNum > 1)
      sameName = true;
    else if (sameNum == 1 && !currentSame )
      sameName = true;

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
