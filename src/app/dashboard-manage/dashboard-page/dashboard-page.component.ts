import { Component, OnInit, ViewChild, AfterViewInit, QueryList, ElementRef, ViewContainerRef, ViewChildren } from '@angular/core';
import { DashboardFolderComponent } from '../dashboard-folder/dashboard-folder.component';
import { DashboardFileComponent } from '../dashboard-file/dashboard-file.component';
import { fromEvent } from 'rxjs';
import { map, tap, takeUntil, concatAll, mapTo} from 'rxjs/operators';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit, AfterViewInit {
  
  @ViewChildren('move') move: QueryList<any>;

  mousedown;
  mouseUp;
  mouseMove;

  dataMapping;

  currentLocation:string;

  chooseForm = 'A';
  mapping = new Map<string, any>(
    [
      ['A', DashboardFolderComponent],
      ['B', DashboardFileComponent],
    ]
  );

  constructor() { }

  ngOnInit() {

    this.currentLocation = 'root'

  /*
    dataMapping 屆時需有
    檔案名稱 name
    型態 type
    檔案數目 number
    修改日期 date

  
  */

    this.dataMapping = 
    {
      root:{
        previous:'',
        datas:[
                {
                  name:'folder1',
                  type: 'A'
                },
                {
                  name:'file1',
                  type: 'B'
                },
                {
                  name:'fle2',
                  type: 'B'
                }
              ]
      },
      folder1:{
        previous:'root',
        datas:[{
                name:'folder2',
                type: 'A'
              },
              {
                name:'folder3',
                type: 'A'
              },
              {
                name:'file3',
                type: 'B'
              },
              {
                name:'fle4',
                type: 'B'
              },
              {
                name:'fle5',
                type: 'B'
              }
            ]
      }

    }
    
      
  }

  ngAfterViewInit(): void {

    this.mouseUp = fromEvent(document,'mouseup')
    this.mouseMove = fromEvent(document, 'mousemove')


    
  }

  mouseM(index){
    this.mousedown = fromEvent(this.move.toArray()[index].nativeElement,'mousedown')
    this.mousedown
    .pipe(
      map(() =>
        this.mouseMove
        .pipe(
          takeUntil(this.mouseUp)
        )
        .subscribe(
          (e)=> {
            this.move.toArray()[index].nativeElement.style.position = 'absolute'
            this.move.toArray()[index].nativeElement.style.top = (e.clientY -18 ) + 'px'
            this.move.toArray()[index].nativeElement.style.left = e.clientX -50 + 'px'
            //console.log(e)
          }, // next
          () => {}, // error
          () => {   // complete
            this.move.toArray()[index].nativeElement.style.position = 'unset';
           
          }
          
        )
      )
    ).subscribe(
      (e) => {
        
      }
    );
  }


  changeFolder(foldername){
    if(this.dataMapping[foldername] != undefined)
      this.currentLocation = foldername;
  }

}
