import { Component, OnInit,  AfterViewInit, QueryList, ViewChildren, OnDestroy, ViewChild, ElementRef, Output, EventEmitter, Inject } from '@angular/core';
import { fromEvent} from 'rxjs';
import { map, tap, takeUntil} from 'rxjs/operators';
import { Validators, FormControl } from '@angular/forms';
import { forbiddenNameValidator } from '../shared/duplicate-name.directive';
import { dbmModel } from '../shared/model/dbmModel';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface DialogData {
  id: string;
  name: string;
}

@Component({
  selector: 'app-dashboard-managing',
  templateUrl: './dashboard-managing.component.html',
  styleUrls: ['./dashboard-managing.component.scss']
})
export class DashboardManagingComponent implements OnInit, AfterViewInit, OnDestroy {
  

  @Output() updatePath = new EventEmitter();


  @ViewChildren('checkbox') checkboxs : QueryList<any>;

  //all selected checkbox checked
  checked:boolean = false;

  //each data's checkbox status
  checkBoxGroup: any;


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

  deleteElement(id,name,type){ // element: id
    if(this.selectedElements.length != 0){
      this.selectedElements = this.selectedElements.filter((value) => {
        if(value.id != id )
          return true;
      })
    }
    /**
     * Http remind!
     * should send http delete dashboard / folder
     */

    if(type == 'folder'){
      delete this.dataMapping[id];
    }
    

    this.dataMapping[this.currentLocation]['datas']
    .forEach((el,ind) => {
        if(id == el.id){
          this.dataMapping[this.currentLocation]['datas']
          .splice(ind, 1)

        }
                      
    })
    this.reCheckElement(this.currentLocation);
  }

  deleteAllSelected(){
    if(this.selectedElements.length != 0){
      this.selectedElements.forEach((e) => {
        this.deleteElement(e.id,e.name,e.type);
      })
      this.clearCheck()
    }
  }


  constructor( private router: Router, public dialog: MatDialog ) { }

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

  /*
    dataMapping 屆時需有
    檔案名稱 name
    型態 type
    檔案數目 number
    修改日期 date

  
  */

    
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

    //init the check box value
    this.checkBoxGroup = {};
    for(let k in this.dataMapping){
      this.dataMapping[k].datas.forEach((value) => {
        this.checkBoxGroup[value.id] = false;
      })
      
    }
    
      
  }



  ngAfterViewInit(): void {

    

    this.mouseUp$ = fromEvent(document,'mouseup');

    this.mouseMove$ = fromEvent(document, 'mousemove')

    this.mouseClickSelect_subscribe();

    

    
  }

  /**
   * The function which is going to 
   * subscribe observable of moving element
   * 
   * resubscribe timing: click all, click one element 
   * p.s. because of updating 
   */
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
                  /**
                   * when mouse move, choosing the target element which has 'canstore' class
                   * to be targetFolder.
                   * Reason:
                   * when trying to store in a folder, mouse usually go up on target element.
                   * 
                   */
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

                  /**
                   * below are updating the data structure
                   * 
                   * If target folder is not undefined and 
                   * selected elements are not empty, it means some of datas moved 
                   * to target folder. 
                   * 
                   * need to send http request to backend 
                   * for updating datas
                   */
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
                            //folder push to first position, file push to last position
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
              /**
               * when mouse down, group up folders which are not selected.
               * It means selected elements can be stored to it
               */

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
      },100)
    
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
    
    this.router.navigate(
      ['dashboardManage', 
        { 
          feature: 'manage', 
          location: folderID
        }
    ]);

    /**
     * The following code is to build the
     * data structure of currentLocationArray
     * 
     * replace the following code to http get
     * the currentLocationArray should come from back-end
     * 
     * ----------------start
     */

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

    this.updatePath.emit(this.currentLocationArray);

    /**
     * ----------------------------------------end
     */

    this.reCheckElement(folderID);
    
    this.clearCheck();

    //re subscribe
    this.mouseClickSelect_subscribe();
    
    

    
    
    
  }

  reCheckElement(folderid){

    /**
     * make a http request for update dataMapping
     */

    if(this.dataMapping[folderid] != undefined){
      this.currentLocation = folderid;

      
      
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

    /**
     * Should change the following 'for loop' to refresh the value of
     * checkBoxGroup because datamapping will change
     * 
     * 
     * 
     *  this.checkBoxGroup = {};
        for(let k in this.dataMapping){
          this.dataMapping[k].datas.forEach((value) => {
            this.checkBoxGroup[value.id] = false;
          })
          
        }
     */

    for(let k in this.checkBoxGroup){
      this.checkBoxGroup[k] = false;
    }
    //clear selected elements
    this.selectedElements = new Array();
    
  }



  openDialog(id,name,type): void {
    const dialogRef = this.dialog.open(DeleteDialog, {
      width: '500px',
      data: {id: id, name: name, type: type}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result == undefined)
        console.log('You cancel the delete');
      else
        this.deleteElement(result.id,result.name,result.type);
      console.log('The dialog was closed');
      //this.deleteElement(result.id,result.name,result.type);
    });
  }

  openDeleteAllDialog(): void {
    const dialogRef = this.dialog.open(DeleteAllDialog, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('delete all: '+result)
      if(result == undefined )
        console.log('You cancel the delete');
      else
        this.deleteAllSelected();
      console.log('The dialog was closed');
      //this.deleteElement(result.id,result.name,result.type);
    });
  }

}


@Component({
  selector: 'delete-dialog',
  templateUrl: 'delete-dialog.html',
})
export class DeleteDialog {

  constructor(
    public dialogRef: MatDialogRef<DeleteDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'delete-all-dialog',
  templateUrl: 'delete-all-dialog.html',
})
export class DeleteAllDialog {

  constructor(
    public dialogRef: MatDialogRef<DeleteDialog>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
