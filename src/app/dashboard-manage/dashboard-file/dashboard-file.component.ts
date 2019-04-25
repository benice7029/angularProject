import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { forbiddenNameValidator } from '../shared/duplicate-name.directive';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-dashboard-file',
  templateUrl: './dashboard-file.component.html',
  styleUrls: ['./dashboard-file.component.scss']
})
export class DashboardFileComponent implements OnInit, OnChanges, AfterViewInit {
  
  

  @Input('fileName') fileName:string;

  @Input('fileId') fileId:string;

  @Output() preventMove = new EventEmitter();

  @Input('editing') editing: boolean;

  @Input('currentLocationFiles') currentLocationFiles;

  fileNameFormControl ;

  canEdit: boolean = false;


  @ViewChild('fileInput') fi: ElementRef;

  @ViewChild('editBtn') editBtn: ElementRef;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.editBtnSub();
  }

  ngOnChanges(changes:SimpleChanges): void {
    
  }

  edit(){
    if(!this.canEdit){
      this.fileNameFormControl = new FormControl('', [
        Validators.required,
        forbiddenNameValidator(this.currentLocationFiles, this.fileId, 'dashboard')
      ]);
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
       * should send request here for updating dashboard name
       * and send response of updated datamapping to parent component
       * for updating datamapping
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

    if(!this.canEdit)
      this.waitForNewElement();
  }


  waitForNewElement(){


    if(this.editBtn == undefined){
      let checkElement = setInterval(() => {
        if(this.editBtn != undefined){
          this.editBtnSub();
          clearInterval(checkElement);
        }
      },100)
    }

  }

  editBtnSub(){


    fromEvent(this.editBtn.nativeElement, 'click')
    .subscribe(() => {
      this.fi.nativeElement.focus();
    })
  }

}
