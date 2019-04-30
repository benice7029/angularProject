import { Pipe, PipeTransform } from '@angular/core';
import { iif } from 'rxjs';

@Pipe({
  name: 'checkedPipe',
  pure: false
})
export class CheckedPipePipe implements PipeTransform {

  transform(checkedData: Array<any>, args?: any): any {


    if(checkedData == null)
      return null;

    let result :Array<{
      checkedPos:Number,
      pos:Number
    
    }> = [];
    
    let i = 0;

    checkedData.forEach((element,index) => {
      if(element){
        result.push({
          checkedPos: index,
          pos: i
        })
        i++;
      }
      
    });

    return result;
  }

}
