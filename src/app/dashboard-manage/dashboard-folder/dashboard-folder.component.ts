import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, Input, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';
import { fromEvent } from 'rxjs';
import { merge, bufferTime, filter, tap } from 'rxjs/operators';
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

  @ViewChild('folderInput') fi: ElementRef;

  @ViewChild('editBtn') editBtn: ElementRef;

  changeFolder$;

  cancelRename$;

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

    if(this.cancelRename$ != undefined)
      this.cancelRename$.unsubscribe();
  }

  ngOnChanges(changes:SimpleChanges): void {
    /**
     * when @Input editing is true,
     * prevent change folder observable be emited. 
     */
    if(changes.editing != undefined && changes.editing.currentValue){
      //console.log("editing....");
      if(this.changeFolder$ != undefined){
        this.changeFolder$.unsubscribe();
      }
        
      //console.log(this.changeFolder$)
    }else{
      this.changeFolderLocation();
      //console.log(this.changeFolder$)
    }


    
      
  }

  ngAfterViewInit(): void {

    this.editBtnSub();


    /**
     * observable cancelRename$:
     * when not click on elements which have 
     * dataset type 'save' or 'focus'
     * will set input to original foldername
     */

    this.cancelRename$ = 
    fromEvent(document, 'mousedown')
    .pipe(
      tap((e) => {
        let ele = e.target as HTMLElement
        if(this.canEdit && ele.dataset.type != 'save')
          console.log('cancel');
        
      }),
      filter(e => {
        let ele = e.target as HTMLElement
        if(this.canEdit && ele.dataset.type != 'save' && ele.dataset.type != 'focus')
            return true;
        else
            return false;
      })

    )
    .subscribe((e) => {
      console.log('click outside')
      //return to original value
      this.fi.nativeElement.value = this.folderName;
      this.edit();
    })

  }

  edit(){
    if(!this.canEdit){
      this.folderNameFormControl = new FormControl('', [
        Validators.required,
        forbiddenNameValidator(this.currentLocationFiles, this.folderId, 'folder')
      ]);
      
      this.preventMove.emit(
        {
          id:this.folderId,
          name:this.folderName,
          type:'folder'
        }
      );
    }else{
      if(this.fi.nativeElement.value.trim() == '')
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
       * and send response of updated datamapping to parent component
       * for updating datamapping
       */

      
      this.preventMove.emit({
        id:this.folderId,
        name:this.fi.nativeElement.value,
        type:'folder'
      });
    }
    
    this.canEdit = !this.canEdit;

    if(!this.canEdit)
      this.waitForNewElement();

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
          this.changeFolder.emit(this.folderId);
        },
        (error) => {
          console.log(error);
        }
      )
  }

  /**
   * wait for input element created, then subscribe observable which 
   * will focus on input
   *  */
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
