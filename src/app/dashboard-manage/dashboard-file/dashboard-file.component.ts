import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { forbiddenNameValidator } from '../shared/duplicate-name.directive';

@Component({
  selector: 'app-dashboard-file',
  templateUrl: './dashboard-file.component.html',
  styleUrls: ['./dashboard-file.component.scss']
})
export class DashboardFileComponent implements OnInit, OnChanges {
  

  @Input('fileName') fileName:string;

  @Input('fileId') fileId:string;

  @Output() preventMove = new EventEmitter();

  @Input('editing') editing: boolean;

  @Input('currentLocationFiles') currentLocationFiles;

  fileNameFormControl ;

  canEdit: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes:SimpleChanges): void {
    this.fileNameFormControl = new FormControl('', [
      Validators.required,
      forbiddenNameValidator(this.currentLocationFiles, this.fileName, 'dashboard')
    ]);
  }

  edit(){
    if(!this.canEdit){
      this.preventMove.emit(
        {
          id:this.fileId,
          name:this.fileName,
          type:'file'
        }
      );
    }else{
      if(this.fileName.trim() == '')
        return false;
      if(this.fileNameFormControl.hasError('forbiddenNameValidator'))
        return false;
      /**
       * check if file name is duplicate or not
       */

      /**
       * Http remind!
       * should send request here for updating folder name
       */


      this.preventMove.emit(
        {
          id:this.fileId,
          name:this.fileName,
          type:'file'
        }
      );
    }
    
    this.canEdit = !this.canEdit;
  }

}
