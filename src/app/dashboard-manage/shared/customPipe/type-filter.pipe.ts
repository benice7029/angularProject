import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'typeFilter'
})
export class TypeFilterPipe implements PipeTransform {

  transform(sourceDatas: Array<any>, filterType: any): any {

    let result = [];

    sourceDatas.forEach(element => {
      element.type == filterType ? result.push(element) : false ;
      
    });

    return result;
  }

}
