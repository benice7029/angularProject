import { Component, OnInit,  AfterViewInit, QueryList, ViewChildren, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { DashboardFolderComponent } from '../dashboard-folder/dashboard-folder.component';
import { DashboardFileComponent } from '../dashboard-file/dashboard-file.component';
import { fromEvent, zip, of, Observable, from } from 'rxjs';
import { map, tap, takeUntil, bufferTime, filter, startWith, mergeAll, merge} from 'rxjs/operators';
import { Validators, FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { forbiddenNameValidator } from '../shared/duplicate-name.directive';
import { dbmModel } from '../shared/model/dbmModel';

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
  

  switch = false;
  

  fileForm: FormGroup = this.fb.group({
    fileGroup: '',
  });

  @ViewChildren('checkbox') checkboxs : QueryList<any>;


  checked:boolean = false;


  checkBoxGroup: any;


  /**
   * for auto complete's select option data
   */
  fileGroups: FileType[] = [
    {
      type: 'Folder',
      files: ['Folder1', 'Folder2', 'Folder3']
    },
    {
      type: 'dashboard',
      files: ['File1', 'File2', 'File3']
    }
  ];

  fileGroupOptions: Observable<FileType[]>;
  
  @ViewChildren('move') move: QueryList<any>;

  mouseClick$;

  //mouse move until mouse up: observable
  mouseUp$;
  //mouse down then mouse move: observable
  mouseMove$;
  //move file: observable

  selectedElementEvent$;

  cancelRename$;

  selectedElements: Array<any>;
  
  targetFolder: string;

  targetFolderName: string;

  totalData: Array<dbmModel>;

  dataMapping;// folder and dashboard data

  currentLocation:string;

  currentLocationArray:Array<{id:string,name:string}>;//location path  

  editing:boolean;

  /**
   * make below two-way databinding with add form
   * become component?
   * 
   * reuse in dashboard-folder, dashboard-file for edit
   */

  @ViewChild('newFolder') private nfd: ElementRef;

  @ViewChild('newFile') private nfl: ElementRef;

  folderNameFormControl = new FormControl('', [
    Validators.required,
    forbiddenNameValidator([], '', 'folder')
  ]);;
  fileNameFormControl = new FormControl('', [
    Validators.required,
    forbiddenNameValidator([], '', 'dashboard')
  ]);

  //for testing...
  id:number = 99;

  addNewEle(){

    this.folderNameFormControl = new FormControl('', [
      Validators.required,
      forbiddenNameValidator(this.dataMapping[this.currentLocation].datas, '', 'folder')
    ]);
    this.fileNameFormControl = new FormControl('', [
      Validators.required,
      forbiddenNameValidator(this.dataMapping[this.currentLocation].datas, '', 'dashboard')
    ]);
  }

  save(newElement,type){

    /**
     * Http remind!
     * 
     * should send request and get result from backend
     * for value of id
     */
    let testId = this.id ++ + ''
    // if(this.folderName.trim() == '')
    //   return false;
    if(this.folderNameFormControl.hasError('forbiddenNameValidator'))
      return false;

    if(this.fileNameFormControl.hasError('forbiddenNameValidator')){
      console.log('same....')
      return false;
    }
      

    if(type == 'folder'){
      this.dataMapping[testId] = 
      {
        name:newElement,
        previous:this.currentLocation,
        datas:[]

      }
      this.dataMapping[this.currentLocation]['datas']
      = [ {
            id:testId,
            name:newElement,
            type: type,
            editor: 'Ben',
            EDate: '2019/04/10'
          }
          ,...this.dataMapping[this.currentLocation]['datas']
        ]
    }else{
      this.dataMapping[this.currentLocation]['datas']
      .push(
        {
          id:testId + '',
          name:newElement,
          type: type,
          editor: 'Ben',
          EDate: '2019/04/10'
        }
      )
    }

    console.log(this.dataMapping)
    
    this.reCheckElement(this.currentLocation);
  }

  deleteElement(element,type){ // element: id
    if(this.selectedElements.length != 0){
      this.selectedElements = this.selectedElements.filter((value) => {
        if(value.name != element )
          return true;
      })
    }
    /**
     * Http remind!
     * should send http delete dashboard / folder
     */

    if(type == 'folder'){
      delete this.dataMapping[element];
    }
    

    this.dataMapping[this.currentLocation]['datas']
    .forEach((el,ind) => {
        if(element == el.id){
          this.dataMapping[this.currentLocation]['datas']
          .splice(ind, 1)

        }
                      
    })
    this.reCheckElement(this.currentLocation);
  }

  deleteAllSelected(){
    if(this.selectedElements.length != 0){
      this.selectedElements.forEach((e) => {
        this.deleteElement(e.id,e.type);
      })
      this.clearCheck()
    }
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
    

    if(this.selectedElementEvent$ != undefined)
      this.selectedElementEvent$.unsubscribe();

    this.mouseClickSelect_unsubscribe();


  }

  ngOnInit() {
    console.log('on init')
    this.currentLocation = 'Root'

    this.currentLocationArray = new Array();

    this.selectedElements = new Array();

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

    // this.dataMapping = 
    // {
    //   Root:{
    //     previous:'',
    //     datas:[
    //             {
    //               id:'1',
    //               name:'Folder1',
    //               type: 'folder',
    //               editor: 'Ben',
    //               EDate: '2019/04/10'
    //             },
    //             {
    //               id:'2',
    //               name:'File1',
    //               type: 'dashboard',
    //               editor: 'Ben',
    //               EDate: '2019/04/10'
    //             },
    //             {
    //               id:'3',
    //               name:'File2',
    //               type: 'dashboard',
    //               editor: 'Ben',
    //               EDate: '2019/04/10'
    //             },
    //             {
    //               id:'9',
    //               name:'File98',
    //               type: 'dashboard',
    //               editor: 'Ben',
    //               EDate: '2019/04/10'
    //             },
    //             {
    //               id:'10',
    //               name:'File14',
    //               type: 'dashboard',
    //               editor: 'Ben',
    //               EDate: '2019/04/10'
    //             },
    //             {
    //               id:'11',
    //               name:'File233',
    //               type: 'dashboard',
    //               editor: 'Ben',
    //               EDate: '2019/04/10'
    //             }
    //           ]
    //   },
    //   Folder1:{
    //     previous:'Root',
    //     datas:[{
    //             id:'4',
    //             name:'Folder2',
    //             type: 'folder',
    //             editor: 'Ben',
    //             EDate: '2019/04/10'
    //           },
    //           {
    //             id:'5',
    //             name:'Folder3',
    //             type: 'folder',
    //             editor: 'Ben',
    //             EDate: '2019/04/10'
    //           },
    //           {
    //             id:'6',
    //             name:'File3',
    //             type: 'dashboard',
    //             editor: 'Ben',
    //             EDate: '2019/04/10'
    //           },
    //           {
    //             id:'7',
    //             name:'File4',
    //             type: 'dashboard',
    //             editor: 'Ben',
    //             EDate: '2019/04/10'
    //           },
    //           {
    //             id:'8',
    //             name:'File5',
    //             type: 'dashboard',
    //             editor: 'Ben',
    //             EDate: '2019/04/10'
    //           }
    //         ]
    //   },
    //   Folder2:{
    //     previous:'Folder1',
    //     datas:[]
    //   },
    //   Folder3:{
    //     previous:'Folder1',
    //     datas:[]
    //   }

    // }

    this.totalData = [
      {
        id:'1',
        name:'Folder1',
        type: 'folder',
        editor: 'Ben',
        EDate: '2019/04/10',
        Previous: 'Root',
        Tennant: 'Tennant 1'
      },
      {
        id:'2',
        name:'File1',
        type: 'dashboard',
        editor: 'Ben',
        EDate: '2019/04/10',
        Previous: 'Root',
        Tennant: 'Tennant 1'
      },
      {
        id:'3',
        name:'File2',
        type: 'dashboard',
        editor: 'Ben',
        EDate: '2019/04/10',
        Previous: 'Root',
        Tennant: 'Tennant 1'
      },
      {
        id:'9',
        name:'File98',
        type: 'dashboard',
        editor: 'Ben',
        EDate: '2019/04/10',
        Previous: 'Root',
        Tennant: 'Tennant 1'
      },
      {
        id:'10',
        name:'File14',
        type: 'dashboard',
        editor: 'Ben',
        EDate: '2019/04/10',
        Previous: 'Root',
        Tennant: 'Tennant 1'
      },
      {
        id:'11',
        name:'File233',
        type: 'dashboard',
        editor: 'Ben',
        EDate: '2019/04/10',
        Previous: 'Root',
        Tennant: 'Tennant 1'
      },
      {
        id:'4',
        name:'Folder2',
        type: 'folder',
        editor: 'Ben',
        EDate: '2019/04/10',
        Previous: '1',
        Tennant: 'Tennant 1'
      },
      {
        id:'5',
        name:'Folder3',
        type: 'folder',
        editor: 'Ben',
        EDate: '2019/04/10',
        Previous: '1',
        Tennant: 'Tennant 1'
      },
      {
        id:'6',
        name:'File3',
        type: 'dashboard',
        editor: 'Ben',
        EDate: '2019/04/10',
        Previous: '1',
        Tennant: 'Tennant 1'
      },
      {
        id:'7',
        name:'File4',
        type: 'dashboard',
        editor: 'Ben',
        EDate: '2019/04/10',
        Previous: '1',
        Tennant: 'Tennant 1'
      },
      {
        id:'8',
        name:'File5',
        type: 'dashboard',
        editor: 'Ben',
        EDate: '2019/04/10',
        Previous: '1',
        Tennant: 'Tennant 1'
      }
    ]

    this.dataMapping = 
    {
      Root:{
        name:'Root',
        previous:'',
        datas:[
                {
                  id:'1',
                  name:'Folder1',
                  type: 'folder',
                  editor: 'Ben',
                  EDate: '2019/04/10'
                },
                {
                  id:'2',
                  name:'File1',
                  type: 'dashboard',
                  editor: 'Ben',
                  EDate: '2019/04/10'
                },
                {
                  id:'3',
                  name:'File2',
                  type: 'dashboard',
                  editor: 'Ben',
                  EDate: '2019/04/10'
                },
                {
                  id:'9',
                  name:'File98',
                  type: 'dashboard',
                  editor: 'Ben',
                  EDate: '2019/04/10'
                },
                {
                  id:'10',
                  name:'File14',
                  type: 'dashboard',
                  editor: 'Ben',
                  EDate: '2019/04/10'
                },
                {
                  id:'11',
                  name:'File233',
                  type: 'dashboard',
                  editor: 'Ben',
                  EDate: '2019/04/10'
                }
              ]
      },
      1:{
        name:'Folder1',
        previous:'Root',
        datas:[{
                id:'4',
                name:'Folder2',
                type: 'folder',
                editor: 'Ben',
                EDate: '2019/04/10'
              },
              {
                id:'5',
                name:'Folder3',
                type: 'folder',
                editor: 'Ben',
                EDate: '2019/04/10'
              },
              {
                id:'6',
                name:'File3',
                type: 'dashboard',
                editor: 'Ben',
                EDate: '2019/04/10'
              },
              {
                id:'7',
                name:'File4',
                type: 'dashboard',
                editor: 'Ben',
                EDate: '2019/04/10'
              },
              {
                id:'8',
                name:'File5',
                type: 'dashboard',
                editor: 'Ben',
                EDate: '2019/04/10'
              }
            ]
      },
      4:{
        name:'Folder2',
        previous:'1',
        datas:[]
      },
      5:{
        name:'Folder3',
        previous:'1',
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

    

    this.mouseUp$ = fromEvent(document,'mouseup');

    this.mouseMove$ = fromEvent(document, 'mousemove')

    this.mouseClickSelect_subscribe();

    

    
  }

  selectedObservable_subscribe(){
    let waitElementCreated = 
      setInterval(() => {
        if(this.selectedElements.length == document.getElementsByClassName('selected').length){
          this.selectedElementEvent$ = 
          fromEvent(document.getElementsByClassName('selected'),'mousedown')
          .pipe(
                
            map(() =>
              this.mouseMove$
              .pipe(
                
                tap((e: MouseEvent) => {
                  let element = e.target as HTMLElement;
                  this.targetFolder = element.dataset.targetid;
                  let ele = document.getElementById(this.targetFolder);
                  if(ele != undefined){
                    if(ele.classList.contains('canStore')){
                      this.targetFolderName = ele.getAttribute('data-targetname')
                    }else{
                      this.targetFolderName = '';
                      this.targetFolder = undefined;
                    }

                  }else{
                    this.targetFolderName = '';
                  }
                }),
                
                takeUntil(this.mouseUp$),
                
              )
              .subscribe(
                (e)=> {
                  let selectedArea = document.getElementById('selectedArea');
                  
                  selectedArea.style.top = (e.clientY -247 ) + 'px'
                  selectedArea.style.left = e.clientX  + 'px'
                  selectedArea.style.display = 'unset'
                  
                }, // next
                () => {}, // error
                () => {   // complete
                  let ele = document.getElementById(this.targetFolder);
                  if(ele != undefined){
                    if(ele.classList.contains('canStore')){
                      this.selectedElements.forEach((selected) => {
                        if(selected.type == 'folder'){
                          this.dataMapping[selected.id].previous
                          = ele.getAttribute('data-id');
                        }
                        this.dataMapping[this.currentLocation]['datas'].forEach((deleteCheck,ind) => {
                          if(deleteCheck.id == selected.id){

                            if(selected.type == 'folder'){
                              this.dataMapping[ele.getAttribute('data-id')]['datas']
                              = [deleteCheck,...this.dataMapping[ele.getAttribute('data-id')]['datas']]
                            }else{
                              this.dataMapping[ele.getAttribute('data-id')]['datas']
                              .push(deleteCheck);
                            }

                            this.dataMapping[this.currentLocation]['datas']
                            .splice(ind, 1)
                          }
                        })
                        
                      })
                      //mouseClickSelect will be unsubscribe in clearCheck
                      this.clearCheck();
                      //re subscribe
                      this.mouseClickSelect_subscribe();
                      
                      /**
                       * need to send http request to backend 
                       * for updating datas */

                    }
                  }
                  
                  

                  console.log('mouse up')
                  Array.from(document.getElementsByClassName('folder')).forEach(element => {
                    if(element.classList.contains('canStore'))
                      element.classList.remove('canStore')
                  });
                  document.getElementById('selectedArea').style.display = 'none'
                }
                
              )
            )
          ).subscribe(
            (e) => {
              
              console.log('mouse down');
              Array.from(document.getElementsByClassName('folder')).forEach(element => {
                if(element.classList.contains('unselected'))
                  element.classList.add('canStore')
              });
            },
            () => {}, // error
            () => {   // complete
              console.log('complete')
            }
          )
          clearInterval(waitElementCreated);
        }
      },200)
    
  }

  selectedObservable_unsubscribe(){
    if(this.selectedElementEvent$ != undefined)
      this.selectedElementEvent$.unsubscribe();
  }


  mouseClickSelect_subscribe(){
    this.mouseClick$ = 
    fromEvent(document.body,'click')
    .subscribe((e) => {
      let ele = e.target as HTMLElement;
      if(ele.dataset.targetid != undefined && ele.className != 'previous'){
        //console.log(e)
        //console.log(`choose ${ele.dataset.targetid}`);
        this.checkBoxGroup[ele.dataset.targetid] = !this.checkBoxGroup[ele.dataset.targetid]
        this.check(ele.dataset.targetid);
      }
      //console.log(e)
    });
  }

  mouseClickSelect_unsubscribe(){
    if(this.mouseClick$ != undefined)
      this.mouseClick$.unsubscribe();
  }


  changeFolder(folderID){
    
    let update = false;

    if(folderID != 'Root'){
      if(this.currentLocationArray.length == 0){
        this.currentLocationArray.push(
          {
            id:folderID,
            name:this.dataMapping[folderID].name
        });
        update = true;
      }else{

        for(var i = 0 ; i < this.currentLocationArray.length ; i ++){
          if(this.currentLocationArray[i].id == folderID){
            this.currentLocationArray = this.currentLocationArray.slice(0,i );
            break;
            update = true;
          }
        }

        if(!update){
          this.currentLocationArray.push(
            {
              id:folderID,
              name:this.dataMapping[folderID].name
          });
        }
        
      }

      

      
    }else
      this.currentLocationArray = new Array();
    
    this.clearCheck();

    //re subscribe
    this.mouseClickSelect_subscribe();
    
    this.reCheckElement(folderID);

    
    
    
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
    //cancel selected 
    this.clearCheck();


    //when false, resubscribe observable
    if(this.editing){
      

      /**
       * change dataMapping value
       */

      //no need ?
      if(v.type == 'folder'){
        this.dataMapping[v.id].name = v.name;
        
      }
      this.dataMapping[this.currentLocation].datas.forEach(ele => {
        if(ele.id == v.id)
          ele.name = v.name;
      })
      //no need?

      this.reCheckElement(this.currentLocation);
      this.mouseClickSelect_subscribe();
    }else{

      /**
       * prevent move element:
       * all moving observable unsubscribe
       *  */
      

    }

    

    this.editing = !this.editing;
    
    console.log(this.dataMapping)

  }

  check(id){
    this.selectedObservable_unsubscribe();
    document.getElementById(id).classList.remove('unselected');
    document.getElementById(id).classList.add('selected')
    this.checked = false;
    for(let k in this.checkBoxGroup){
      if(this.checkBoxGroup[k])
        this.checked = true;
    }
    if(this.checkBoxGroup[id]){
      this.checked = true;
      this.selectedElements.push({
        id: id,
        name: document.getElementById(id).getAttribute('data-targetName'),
        type: document.getElementById(id).classList[0]
      })
    }else{
      this.selectedElements = this.selectedElements.filter((value) => {
        if(value.id != id )
          return true;
      })
    }

    
    this.selectedObservable_subscribe();
    
  }

  checkAll(){
    this.selectedObservable_unsubscribe();
    

    this.checkboxs.forEach((ele) => {
      if(this.checked){
        this.checkBoxGroup[ele.id] = true;
        this.selectedElements.push({
          id: ele.id,
          name: document.getElementById(ele.id).getAttribute('data-targetName'),
          type: document.getElementById(ele.id).classList[0]
        })
      }else{
        this.checkBoxGroup[ele.id] = false;
        this.selectedElements = this.selectedElements.filter((value) => {
          if(value.id != ele.id )
            return true;
        })
      }
        
      
      
      
    })

    this.selectedObservable_subscribe();
    
  }

  clearCheck(){
    this.selectedObservable_unsubscribe();
    this.mouseClickSelect_unsubscribe();
    this.checked = false;
    for(let k in this.checkBoxGroup){
      this.checkBoxGroup[k] = false;
    }
    //clear selected elements
    this.selectedElements = new Array();
    
  }

  selectLocation(){
    console.log('selected!!')
  }

  


}
