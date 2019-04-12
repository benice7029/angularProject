import { Component, OnInit,  AfterViewInit, QueryList, ViewChildren, OnDestroy } from '@angular/core';
import { DashboardFolderComponent } from '../dashboard-folder/dashboard-folder.component';
import { DashboardFileComponent } from '../dashboard-file/dashboard-file.component';
import { fromEvent, zip, of } from 'rxjs';
import { map, tap, takeUntil} from 'rxjs/operators';
import { Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit, AfterViewInit, OnDestroy {
  
  
  @ViewChildren('move') move: QueryList<any>;

  //mouse move until mouse up: observable
  mouseUp$;
  //mouse down then mouse move: observable
  mouseMove$;
  //move file: observable
  moveFile$;

  allMoveingElement$: Array<any> = [];

  checked:boolean = false;

  dataMapping;// folder and dashboard data

  currentLocation:string;

  /**
   * make below two-way databinding with add form
   * become component?
   * 
   * reuse in dashboard-folder, dashboard-file for edit
   */

   

  folderNameFormControl = new FormControl('', [
    Validators.required
  ]);
  fileNameFormControl = new FormControl('', [
    Validators.required
  ]);

  //for testing...
  id:number = 99;

  save(newElement,type){

    /**
     * Http remind!
     * 
     * should send request and get result from backend
     * for value of id
     */

    if(type == 'folder'){
      this.dataMapping[newElement] = 
      {
        previous:this.currentLocation,
        datas:[]

      }
    }

    this.dataMapping[this.currentLocation]['datas']
    .push(
      {
        id:this.id ++ + '',
        name:newElement,
        type: type,
        fileNumber: type == 'folder' ? '0' : '1',
        editor: 'Ben',
        EDate: '2019/04/10'
      }
    )
    this.changeFolder(this.currentLocation);
  }

  deleteElement(element){

  }

  

  mapping = new Map<string, any>(
    [
      ['folder', DashboardFolderComponent],
      ['file', DashboardFileComponent],
    ]
  );

  constructor() { }

  ngOnDestroy(): void {
    /**
     * Notice:
     * check if all of observalbe in this component be unsubscribed
     */
  }

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
                  id:'1',
                  name:'Folder1',
                  type: 'folder',
                  fileNumber: '5',
                  editor: 'Ben',
                  EDate: '2019/04/10'
                },
                {
                  id:'2',
                  name:'File1',
                  type: 'file',
                  fileNumber: '1',
                  editor: 'Ben',
                  EDate: '2019/04/10'
                },
                {
                  id:'3',
                  name:'File2',
                  type: 'file',
                  fileNumber: '1',
                  editor: 'Ben',
                  EDate: '2019/04/10'
                },
                {
                  id:'9',
                  name:'File98',
                  type: 'file',
                  fileNumber: '1',
                  editor: 'Ben',
                  EDate: '2019/04/10'
                },
                {
                  id:'10',
                  name:'File14',
                  type: 'file',
                  fileNumber: '1',
                  editor: 'Ben',
                  EDate: '2019/04/10'
                },
                {
                  id:'11',
                  name:'File233',
                  type: 'file',
                  fileNumber: '1',
                  editor: 'Ben',
                  EDate: '2019/04/10'
                }
              ]
      },
      Folder1:{
        previous:'Root',
        datas:[{
                id:'4',
                name:'Folder2',
                type: 'folder',
                fileNumber: '7',
                editor: 'Ben',
                EDate: '2019/04/10'
              },
              {
                id:'5',
                name:'Folder3',
                type: 'folder',
                fileNumber: '6',
                editor: 'Ben',
                EDate: '2019/04/10'
              },
              {
                id:'6',
                name:'File3',
                type: 'file',
                fileNumber: '1',
                editor: 'Ben',
                EDate: '2019/04/10'
              },
              {
                id:'7',
                name:'File4',
                type: 'file',
                fileNumber: '1',
                editor: 'Ben',
                EDate: '2019/04/10'
              },
              {
                id:'8',
                name:'File5',
                type: 'file',
                fileNumber: '1',
                editor: 'Ben',
                EDate: '2019/04/10'
              }
            ]
      },
      Folder2:{
        previous:'Folder1',
        datas:[]
      },
      Folder3:{
        previous:'Folder1',
        datas:[]
      }

    }
    
      
  }

  ngAfterViewInit(): void {

    this.mouseUp$ = fromEvent(document,'mouseup')
    this.mouseMove$ = fromEvent(document, 'mousemove')

    this.mouseM()
  }

  mouseM(){

    /**
     * when calling mouseM function,
     * it will create new observable be subscribed.
     * It's important to preventing fromEvent observable 
     * which detect moving element repeat subscribe.
     */

    /**
     * If allMoveingElement$ is not empty,it has observable
     * unsubscribed.
    */
    if(this.allMoveingElement$.length > 0){
        this.allMoveingElement$.forEach(
          (o) => {
            o.unsubscribe();
          }
        )
        this.allMoveingElement$ = [];
    }

    this.move.forEach((element,index) => {
      this.allMoveingElement$.push(
        fromEvent(element.nativeElement, 'mousedown')
        .pipe(
          map(() =>
            this.mouseMove$
            .pipe(
              tap(() => {
                console.log('moving...')
              }),
              takeUntil(this.mouseUp$)
            )
            .subscribe(
              (e)=> {
                if(this.move.toArray()[index] != undefined){
                  this.move.toArray()[index].nativeElement.style.position = 'absolute';
                  this.move.toArray()[index].nativeElement.style.width = '75vw' ;
                  this.move.toArray()[index].nativeElement.style.top = (e.clientY -18 ) + 'px'
                  this.move.toArray()[index].nativeElement.style.left = e.clientX  +10 + 'px'
                  
                }
                
                
                //console.log(e)
              }, // next
              () => {}, // error
              () => {   // complete
                console.log('mouse up')


                if(this.move.toArray()[index] != undefined){
                  this.move.toArray()[index].nativeElement.classList.remove('moving')
                  this.move.toArray()[index].nativeElement.style.position = 'unset';
                  this.move.toArray()[index].nativeElement.style.width = 'unset' ;
                }
                
                Array.from(document.getElementsByClassName('canStore'))
                .forEach((el) => {
                  if(el.classList.contains('previousFolder'))
                    console.log('');
                  else
                    el.classList.remove('canStore');
                });

                
                
                
              }
              
            )
          )
        ).subscribe(
          (e) => {
            if(this.move.toArray()[index] != undefined)
              this.move.toArray()[index].nativeElement.classList.add('moving');
            
            Array.from(document.getElementsByClassName('folder'))
            .forEach((el) => {
              // Do stuff here
              if(!el.classList.contains('moving'))
                el.classList.add('canStore');
            });

            /**
             * prevent multiple subscribe the observable 
             * which match the condition
             * but execute subscribe in previous moving
             * 
             */

            if(this.moveFile$ != null)
              this.moveFile$.unsubscribe()

            /**
             * when mouse up on element including class 'canStore'
             * and zip with current mouse down element
             * 
             * subscribe can handle move to folder
             * use attr data-id to get dashboard / folder 's id
             * update dataMapping can move dashboard / folder
             */
            this.moveFile$ = 
            zip(
              fromEvent(document.getElementsByClassName('canStore'),'mouseup'),
              of(this.move.toArray()[index] != undefined ? this.move.toArray()[index].nativeElement : null)
              )
            
            .subscribe(
                (v) => {
                    console.log(v)
                    this.dataMapping[this.currentLocation]['datas']
                    .forEach((element,ind) => {
                      if(element.id == v[1].dataset.id){

                        /**
                         * push current dashboard / folder 
                         * to target folder
                         * 
                         * remove current dashboard / folder
                         * from current folder
                         */

                        let target = v[0].target as HTMLTextAreaElement;
                        
                        if(element.type == 'folder'){
                          this.dataMapping[element.name].previous 
                          = target.dataset.targetid
                          this.dataMapping[target.dataset.targetid]['datas']
                          = [element,...this.dataMapping[target.dataset.targetid]['datas']]
                        }else{
                          this.dataMapping[target.dataset.targetid]['datas']
                          .push(element)
                        }

                        

                        this.dataMapping[this.currentLocation]['datas']
                        .splice(ind, 1)
                        
                        console.log(this.dataMapping)

                      }
                      
                    })
                    /**
                     * call changeFolder function because of element change
                     * fromevent observable binding on #move be removed possibly
                     * update the fromevent observable by calling changeFolder
                     */
                    
                    this.moveFile$.unsubscribe();
                    this.changeFolder(this.currentLocation);
                },
                (error) => {
                  
                },
                () => {
                  
                  console.log('complete');
                }
            )

            console.log('mouse down');
          },
          () => {}, // error
          () => {   // complete
            console.log('complete')
          }
        )
      )
      ;
    }) 

    
    
  }


  changeFolder(foldername){
    console.log('change folder: '+foldername)
    if(this.dataMapping[foldername] != undefined){
      this.currentLocation = foldername;

      let checkItmUpdate = setInterval(
        () => {
          console.log('check.....')
          if(this.move.length == 
            document.getElementsByClassName('canMove').length){
              this.mouseM();
              clearInterval(checkItmUpdate);
            }
            
        },
        100
      )
      
    }
    
  }



}
