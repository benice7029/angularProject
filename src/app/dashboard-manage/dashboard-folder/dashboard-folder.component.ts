import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, Input, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';
import { fromEvent } from 'rxjs';
import { merge, bufferTime, filter } from 'rxjs/operators';
import { FormControl, Validators } from '@angular/forms';
import { forbiddenNameValidator } from '../shared/duplicate-name.directive';

@Component({
  selector: 'app-dashboard-folder',
  templateUrl: './dashboard-folder.component.html',
  styleUrls: ['./dashboard-folder.component.scss']

})
export class DashboardFolderComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  

  @Input('folderName') folderName:string;

  @Input('folderId') folderId:string;

  @Input('targetId') targetId:string;

  @Input('editing') editing: boolean;

  @Input('currentLocationFiles') currentLocationFiles;

  @Output() preventMove = new EventEmitter();

  @ViewChild('f') private folder: ElementRef;

  changeFolder$;

  folderNameFormControl ;

  canEdit: boolean = false;

  @Output()
  changeFolder = new EventEmitter();
  

  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    if(this.changeFolder$ != undefined)
      this.changeFolder$.unsubscribe();
  }

  ngOnChanges(changes:SimpleChanges): void {
    //console.log('changing....')
    /**
     * when @Input editing is true,
     * prevent change folder observable be emited. 
     */
    //console.log(changes)
    if(changes.editing.currentValue){
      //console.log("editing....");
      if(this.changeFolder$ != undefined)
        this.changeFolder$.unsubscribe();
      //console.log(this.changeFolder$)
    }else{
      this.changeFolderLocation();
      //console.log(this.changeFolder$)
    }
      
  }

  ngAfterViewInit(): void {

    this.folderNameFormControl = new FormControl('', [
      Validators.required,
      forbiddenNameValidator(this.currentLocationFiles, this.folderName)
    ]);

  }

  edit(){
    if(!this.canEdit){
      this.preventMove.emit(
        {
          id:this.folderId,
          name:this.folderName,
          type:'folder'
        }
      );
    }else{
      if(this.folderName.trim() == '')
        return false;
      if(this.folderNameFormControl.hasError('forbiddenNameValidator'))
        return false;
      /**
       * check if folder name is duplicate or not
       * 
       */
      
      /**
       * Http remind!
       * should send request here for updating folder name
       */
      this.preventMove.emit({
        id:this.folderId,
        name:this.folderName,
        type:'folder'
      });
    }
    
    this.canEdit = !this.canEdit;
  }

  changeFolderLocation(){
    /**
     * 若mouse down 與 up 區間小於0.5s,
     * 即進入下一層
     * 否則將視為parent component 在做拖拉 event
     */
    this.changeFolder$ = 
      fromEvent(this.folder.nativeElement,'click')
      .pipe(
        bufferTime(800),
        filter(arr => arr.length >= 2)
      )
      .subscribe(
        (e) => {
          console.log('go to next...')
          /**
           * output 回 parent 告知往下一層folder
           */
          this.changeFolder.emit(this.folderName);
        },
        (error) => {
          console.log(error);
        }
      )
  }
  

}
