import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import { fromEvent } from 'rxjs';
import { merge, bufferTime, filter } from 'rxjs/operators';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard-folder',
  templateUrl: './dashboard-folder.component.html',
  styleUrls: ['./dashboard-folder.component.scss']

})
export class DashboardFolderComponent implements OnInit, AfterViewInit {

  @Input('folderName') folderName:string;

  @Input('targetId') targetId:string

  @ViewChild('f') private folder: ElementRef;

  changeFolder$;

  folderNameFormControl = new FormControl('', [
    Validators.required
  ]);

  canEdit: boolean = false;

  @Output()
  changeFolder = new EventEmitter();
  

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {

    /**
     * 若mouse down 與 up 區間小於0.5s,
     * 即進入下一層
     * 否則將視為parent component 在做拖拉 event
     */

    this.changeFolderLocation();
  }

  edit(){
    if(!this.canEdit){
      this.changeFolder$.unsubscribe();
    }else{
      if(this.folderName.trim() == '')
        return false;
      /**
       * Http remind!
       * should send request here for updating folder name
       */
      this.changeFolderLocation();
    }
    
    this.canEdit = !this.canEdit;
  }

  changeFolderLocation(){
    this.changeFolder$ = 
      fromEvent(this.folder.nativeElement,'mousedown')
      .pipe(
        merge(fromEvent(this.folder.nativeElement,'mouseup')),
        bufferTime(1200),
        filter(arr => arr.length >= 2)
      )
      .subscribe(
        (e) => {
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
