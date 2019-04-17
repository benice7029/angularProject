import { Component, OnInit,  AfterViewInit, QueryList, ViewChildren, OnDestroy } from '@angular/core';
import { DashboardFolderComponent } from '../dashboard-folder/dashboard-folder.component';
import { DashboardFileComponent } from '../dashboard-file/dashboard-file.component';
import { fromEvent, zip, of, Observable, from } from 'rxjs';
import { map, tap, takeUntil, bufferTime, filter, startWith, mergeAll, merge} from 'rxjs/operators';
import { Validators, FormControl, FormBuilder, FormGroup } from '@angular/forms';

export interface FileType {
  type: string;
  files: string[];
}

export const _filter = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();

  return opt.filter(item => item.toLowerCase().indexOf(filterValue) === 0);
};

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit, AfterViewInit, OnDestroy {
  

  fileForm: FormGroup = this.fb.group({
    fileGroup: '',
  });

  @ViewChildren('checkbox') checkboxs : QueryList<any>;

  surveyForm: FormGroup;

  checked:boolean = false;


  checkBoxGroup: any;


  /**
   * for auto complete's select option data
   */
  fileGroups: FileType[] = [{
    type: 'Folder',
    files: ['Folder1', 'Folder2', 'Folder3']
    },
    {
      type: 'File',
      files: ['file1', 'file2', 'file3']
    }
  ];

  fileGroupOptions: Observable<FileType[]>;
  
  @ViewChildren('move') move: QueryList<any>;

  //mouse move until mouse up: observable
  mouseUp$;
  //mouse down then mouse move: observable
  mouseMove$;
  //move file: observable

  selectedElementEvent$;

  selectedElement: Array<any>;
  

  dataMapping;// folder and dashboard data

  currentLocation:string;

  currentLocationArray:Array<string>;//location path  

  editing:boolean;

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
    this.reCheckElement(this.currentLocation);
  }

  deleteElement(element,type){

    /**
     * should send http delete dashboard / folder
     */

    if(type == 'folder'){
      delete this.dataMapping[element];
    }
    

    this.dataMapping[this.currentLocation]['datas']
    .forEach((el,ind) => {
        if(element == el.name){
          this.dataMapping[this.currentLocation]['datas']
          .splice(ind, 1)

        }
                      
    })
    console.log(this.dataMapping)
    this.reCheckElement(this.currentLocation);
  }

  

  mapping = new Map<string, any>(
    [
      ['folder', DashboardFolderComponent],
      ['file', DashboardFileComponent],
    ]
  );

  constructor( private fb: FormBuilder ) { }

  ngOnDestroy(): void {
    /**
     * Notice:
     * check if all of observalbe in this component be unsubscribed
     */
    


  }

  ngOnInit() {
    console.log('on init')
    this.currentLocation = 'Root'

    this.currentLocationArray = new Array();

    this.selectedElement = new Array();

    this.fileGroupOptions = this.fileForm.get('fileGroup')!.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterGroup(value))
    );
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

    this.checkBoxGroup = {};
    for(let k in this.dataMapping){
      this.dataMapping[k].datas.forEach((value) => {
        this.checkBoxGroup[value.id] = false;
      })
      
    }
    
      
  }

  private _filterGroup(value: string): FileType[] {
    if (value) {
      return this.fileGroups
        .map(group => ({type: group.type, files: _filter(group.files, value)}))
        .filter(group => group.files.length > 0);
    }

    return this.fileGroups;
  }

  ngAfterViewInit(): void {

    this.mouseUp$ = fromEvent(document,'mouseup')
    this.mouseMove$ = fromEvent(document, 'mousemove')

    this.selectedElementEvent$ = 
    fromEvent(document.getElementsByClassName('selected'),'mousedown')
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
            console.log('e can get mouse\'s clientX, clientY...etc')
              // this.move.toArray()[index].nativeElement.style.position = 'absolute';
              // this.move.toArray()[index].nativeElement.style.width = '75vw' ;
              // this.move.toArray()[index].nativeElement.style.top = (e.clientY -130 ) + 'px'
              // this.move.toArray()[index].nativeElement.style.left = e.clientX  +10 + 'px'
              
            
            
            //console.log(e)
          }, // next
          () => {}, // error
          () => {   // complete
            console.log('mouse up')

          }
          
        )
      )
    ).subscribe(
      (e) => {
        
        console.log('mouse down');
      },
      () => {}, // error
      () => {   // complete
        console.log('complete')
      }
    )
    

    this.surveyForm = new FormGroup({
      mainQuestions: new FormGroup({
        payForAll: new FormControl(false),
        payForBook: new FormControl(false),
        payForMusic: new FormControl(false),
        payForMovie: new FormControl(true)
      })
    });
  }



  changeFolder(foldername){
    

    if(foldername != 'Root'){
      if(this.currentLocationArray.includes(foldername))
        this.currentLocationArray = this.currentLocationArray.slice(0,this.currentLocationArray.indexOf(foldername) + 1);
      else
        this.currentLocationArray.push(foldername);
    }else
      this.currentLocationArray = new Array();
    
    this.clearCheck();
    
    this.reCheckElement(foldername);

    
    
  }

  reCheckElement(foldername){

    if(this.dataMapping[foldername] != undefined){
      this.currentLocation = foldername;

      
      
    }
  }

  /**
   * when folder or file is editing, 
   * make sure to prevent every action be emited
   */

  preventMoveing(v){

    //when false, resubscribe observable
    if(this.editing){

      /**
       * change dataMapping value
       */
      if(v.type == 'folder'){
        if(this.dataMapping[v.name] == undefined){
          this.dataMapping[this.currentLocation].datas.forEach(ele => {
            if(ele.id == v.id){
              this.dataMapping[v.name] = 
              this.dataMapping[ele.name];
              
              for(let key in this.dataMapping){
                console.log(key)
                if(this.dataMapping[key].previous == ele.name)
                  this.dataMapping[key].previous = v.name;
              }
              delete this.dataMapping[ele.name];
              ele.name = v.name;
              
              
            }
          })
        }
        

        



      }else{
        this.dataMapping[this.currentLocation].datas.forEach(ele => {
          if(ele.id == v.id)
            ele.name = v.name;
        })
      }

      this.reCheckElement(this.currentLocation);
    }else{

      /**
       * prevent move element:
       * all moving observable unsubscribe
       *  */
      

    }

    

    this.editing = !this.editing;
    
  }

  check(event){
    
    document.getElementById(event.source.id).classList.remove('unselected');
    document.getElementById(event.source.id).classList.add('selected')
    this.checked = false;
    for(let k in this.checkBoxGroup){
      if(this.checkBoxGroup[k])
        this.checked = true;
    }
    if(this.checkBoxGroup[event.source.id]){
      console.log('checked!')
      this.checked = true;
      this.selectedElement.push({
        id: event.source.id,
        type: document.getElementById(event.source.id).classList[0]
      })
    }else{
      this.selectedElement = this.selectedElement.filter((value) => {
        if(value.id != event.source.id )
          return true;
      })
    }
    console.log(this.selectedElement)
    
  }

  checkAll(){
    
    this.checkboxs.forEach((ele) => {
      if(this.checked){
        this.checkBoxGroup[ele.id] = true;
      }else
        this.checkBoxGroup[ele.id] = false;
      
      
      
    })
    
  }

  clearCheck(){
    this.checked = false;
    for(let k in this.checkBoxGroup){
      this.checkBoxGroup[k] = false;
    }
    
  }

  selectLocation(){
    console.log('selected!!')
  }


}
