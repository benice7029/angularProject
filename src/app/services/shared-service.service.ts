import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedServiceService {

  private datas:string[];

  constructor() { 
    this.datas = [];
  }

  putData(data:string){
    this.datas.push(data);
  }

  getDatas(){
    return this.datas;
  }

}
