import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild, Input } from '@angular/core';
import { MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { fromEvent, Observable } from 'rxjs';
import { filter, map, takeUntil, tap, timeout } from 'rxjs/operators';
import { DashboardManageService } from '../shared/service/dashboard-manage.service';
import { dbmModel } from '../shared/model/dbmModel';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardManageAddDialogComponent } from '../dashboard-manage-add-dialog/dashboard-manage-add-dialog.component';
import { DashboardManageDeleteDialogComponent } from '../dashboard-manage-delete-dialog/dashboard-manage-delete-dialog.component';


@Component({
  selector: 'app-dashboard-management',
  templateUrl: './dashboard-management.component.html',
  styleUrls: ['./dashboard-management.component.scss']
})
export class DashboardManagementComponent implements OnInit, AfterViewInit, OnDestroy {


  @Output() updatePath = new EventEmitter();

  editStatus: Array<{ id: string, status: Boolean }> = null;

  //each row's checkbox status.checkbox array is used for moving data.
  checkbox: Array<Boolean> = null;

  //judge whether move area should show up or not
  showUp: boolean = false;

  //source data. ELEMENT_DATA Comes from service calling api
  ELEMENT_DATA: Array<dbmModel>;

  @Input("currentLocation")
  currentLocation: number;


  /**
   * material table
   */

  dataSource;

  displayedColumns: string[] = ['select', 'id', 'name', 'type', 'editor', 'lastModified'];

  @ViewChild(MatSort) sort: MatSort;

  selection = new SelectionModel<dbmModel>(true, []);
  /**
   * material table
   */

  //each row moving observable
  rowMove$

  //the target of moving datas
  targetFolder: string;

  constructor(private dashboardManageService: DashboardManageService, 
              private route: ActivatedRoute,
              private router: Router ,public dialog: MatDialog) { 
  }

  ngOnInit() {

    //this.currentLocation == '0';
    this.getDashBoardManagementData(this.currentLocation);

  }

  ngAfterViewInit(): void {
    console.log(document.getElementsByClassName('ele'))

  }

  ngOnDestroy(): void {
    this.rowMoveUnSubscribe();
  }

  rowMoveSubscribe() {

    setTimeout(() => {
      this.rowMove$ =
        fromEvent(document.getElementsByClassName('ele'), 'mousedown')
          .pipe(
            filter((e: MouseEvent) => {
              console.log('filter....')

              let element = e.target as HTMLElement;
              console.log(element.classList)
              if (element.classList.contains('checked'))
                return true;
            }
            ),
            map(() => {
              fromEvent(document, 'mousemove')

                .pipe(

                  tap((e: MouseEvent) => {
                    if(!this.showUp)
                      this.showUp = true;
                    //console.log(e)
                  }),

                  takeUntil(fromEvent(document, 'mouseup')),

                )
                .subscribe((e) => {
                  let targetElement = e.target as HTMLElement;
                  if (targetElement.classList.contains('canStore'))
                    this.targetFolder = targetElement.dataset.id;
                  else
                    this.targetFolder = '';
                  let selectedArea = document.getElementById('selectedArea');
                  selectedArea.style.top = (e.clientY + 10) + 'px'
                  selectedArea.style.left = (e.clientX + 10) + 'px'
                  selectedArea.style.display = 'unset'
                  console.log('mouse move')
                }, // next
                  () => { }, // error
                  () => {
                    
                    if (this.targetFolder != undefined && this.targetFolder != '') {
                      console.log(this.targetFolder);
                      console.log(this.checkbox);
                      let moveDatas = new Array<dbmModel> ();
                      this.checkbox.forEach((val, index) => {
                        if(val) {
                          moveDatas.push(this.ELEMENT_DATA[index])
                          console.log(this.ELEMENT_DATA[index])
                        }
                      });

                      this.dashboardManageService
                      .moveDashboardManageData(this.targetFolder, moveDatas)
                      .subscribe(
                        (result) => {
                        console.log(result);
                        },
                        (err) => {

                        },
                        () => {
                          console.log("finish...")
                          this.getDashBoardManagementData(this.currentLocation);
                        }
                      )


                      
                      /**
                       * send http put..
                       */

                    }
                    this.showUp = false
                    this.targetFolder = '';
                    console.log('mouse up')
                  }
                )
            })
          )
          .subscribe((e) => {
            console.log(e)
          });
      console.log(this.checkbox)

    }, 0);
  }

  rowMoveUnSubscribe(): void {
    if (this.rowMove$ != undefined) {
      this.rowMove$.unsubscribe();

    }
  }

  getDashBoardManagementData(id): void {
    console.log('getting data.. ' + id)
    //  this.rowMoveSubscribe();
    this.dashboardManageService.getDashboardManageData(id)
      .subscribe(data => {
        this.ELEMENT_DATA = data['datas']['datas'];
        this.dataSource = new MatTableDataSource<dbmModel>(this.ELEMENT_DATA);
        this.dataSource.sort = this.sort;
        this.checkbox = new Array<Boolean>(this.ELEMENT_DATA.length);
        this.editStatus = new Array<{ id: string, status: Boolean }>(this.ELEMENT_DATA.length);
        
        this.rowMoveSubscribe();
        if (data['path'] == undefined || data['path'].length == 0)
          this.currentLocation = 0 ;
        else
          this.currentLocation = data['path'][data['path'].length - 1].id ;
        this.updatePath.emit(data['path']);

        // this.editStatus.forEach((e,i) => {
        //   this.editStatus[i].id = this.ELEMENT_DATA[i]
        // })

      },(err) => {
        console.log(err)
      });

    this.selection.clear();

    this.rowMoveUnSubscribe();

    this.router.navigate(
      ['dashboardManage', 
          { 
            feature: 'manage', 
            location: id
          }
      ]
    );
  }

  openDashboard(id: number){
    console.log('open dashboard, id: ' + id);
  }


  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    //將 sort data redirect to ELEMENT_DATA
    this.ELEMENT_DATA = this.dataSource.sortData(this.dataSource.filteredData, this.dataSource.sort)
    let numSelected;
    let numRows;
    if (this.ELEMENT_DATA[0]['type'] == 'previous') {
      numRows = this.dataSource.data.length - 1;
      
    }

    else {
      numRows = this.dataSource.data.length;
      
    }
    numSelected = this.selection.selected.length;
    
    return numSelected === numRows;
  }



  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach((row,index) => {
        if (this.ELEMENT_DATA[0]['type'] == 'previous') {
          if (index != 0) {
            this.selection.select(row);
          }
        }
        else {
          this.selection.select(row);
        }
        
      });
  }

  addNewDialog(): void {
    const dialogRef = this.dialog.open(DashboardManageAddDialogComponent, {
      width: '500px',
      data: { newData:{name: '', type: '', previous: this.currentLocation } , route: this.route}
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getDashBoardManagementData(this.currentLocation);
    });

  }

  deleteSelected(): void {

    let deleteFolders = new Array<dbmModel> ();
    let deleteDashboards = new Array<dbmModel> ();
    this.checkbox.forEach((val, index) => {
      if(val) {
        if(this.ELEMENT_DATA[index].type == 'folder') {
          deleteFolders.push(this.ELEMENT_DATA[index]) ;
        }
        else {
          deleteDashboards.push(this.ELEMENT_DATA[index]) ;
        }
        
      }
    });

    const dialogRef = this.dialog.open(DashboardManageDeleteDialogComponent, {
      width: '800px',
      data: { delFolders:deleteFolders, delDashboards: deleteDashboards, route: this.route}
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getDashBoardManagementData(this.currentLocation);
    });
  }

  /** The label for the checkbox on the passed row */
  // checkboxLabel(row?: PeriodicElement): string {
  //   if (!row) {
  //     return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
  //   }
  //   return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  // }

}
