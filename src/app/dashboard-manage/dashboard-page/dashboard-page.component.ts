import { Component, OnInit, ViewChild, AfterViewInit, QueryList, ElementRef, ViewContainerRef, ViewChildren } from '@angular/core';
import { DashboardFolderComponent } from '../dashboard-folder/dashboard-folder.component';
import { DashboardFileComponent } from '../dashboard-file/dashboard-file.component';
import { fromEvent, interval } from 'rxjs';
import { map, tap, takeUntil, concatAll, mapTo, delay} from 'rxjs/operators';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit, AfterViewInit {
  
  @ViewChildren('move') move: QueryList<any>;

  mousedown;
  mousedownEvent: Array<any> = [];
  mouseUp;
  mouseMove;


  dataMapping;

  currentLocation:string;

  chooseForm = 'folder';
  mapping = new Map<string, any>(
    [
      ['folder', DashboardFolderComponent],
      ['file', DashboardFileComponent],
    ]
  );

  constructor() { }

  ngOnInit() {
    console.log('on init')
    this.currentLocation = 'Root'

  /*
    dataMapping 屆時需有
    檔案名稱 name
    型態 type
    檔案數目 number
    修改日期 date

  
  */

    this.dataMapping = 
    {
      Root:{
        previous:'',
        datas:[
                {
                  name:'Folder1',
                  type: 'folder'
                },
                {
                  name:'File1',
                  type: 'file'
                },
                {
                  name:'Fle2',
                  type: 'file'
                }
              ]
      },
      Folder1:{
        previous:'Root',
        datas:[{
                name:'Folder2',
                type: 'folder'
              },
              {
                name:'Folder3',
                type: 'folder'
              },
              {
                name:'File3',
                type: 'file'
              },
              {
                name:'Fle4',
                type: 'file'
              },
              {
                name:'Fle5',
                type: 'file'
              }
            ]
      }

    }
    
      
  }

  ngAfterViewInit(): void {

    this.mouseUp = fromEvent(document,'mouseup')
    this.mouseMove = fromEvent(document, 'mousemove')

    this.mouseM()
  }

  mouseM(){
    this.move.forEach((element,index) => {
      fromEvent(element.nativeElement, 'mousedown')
      .pipe(
        map(() =>
          this.mouseMove
          .pipe(
            tap(() => {
              console.log('moving...')
            }),
            takeUntil(this.mouseUp)
          )
          .subscribe(
            (e)=> {
              this.move.toArray()[index].nativeElement.style.position = 'absolute';
              this.move.toArray()[index].nativeElement.style.top = (e.clientY -18 ) + 'px'
              this.move.toArray()[index].nativeElement.style.left = e.clientX  +10 + 'px'
              //console.log(e)
            }, // next
            () => {}, // error
            () => {   // complete
              console.log('mouse up')
              this.move.toArray()[index].nativeElement.classList.remove('moving')
              this.move.toArray()[index].nativeElement.style.position = 'unset';
            
            }
            
          )
        )
      ).subscribe(
        (e) => {
          this.move.toArray()[index].nativeElement.classList.add('moving');
          document.getElementsByClassName
          console.log('mouse down');
        },
        () => {}, // error
        () => {   // complete
          console.log('complete')
        }
      );
    }) 

    
    
  }


  changeFolder(foldername){
    if(this.dataMapping[foldername] != undefined){
      this.currentLocation = foldername;

      let checkItmUpdate = setInterval(
        () => {
          if(this.move.length == 
            document.getElementsByClassName('canMove').length){
              this.mouseM();
              clearInterval(checkItmUpdate);
            }
            
        },
        500
      )
      
    }
    
  }

}
