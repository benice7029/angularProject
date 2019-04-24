import { Component, OnInit,  AfterViewInit, QueryList, ViewChildren, OnDestroy, ViewChild, ElementRef, ComponentFactoryResolver } from '@angular/core';
import { DashboardFolderComponent } from '../dashboard-folder/dashboard-folder.component';
import { DashboardFileComponent } from '../dashboard-file/dashboard-file.component';
import { fromEvent, zip, of, Observable, from } from 'rxjs';
import { map, tap, takeUntil, bufferTime, filter, startWith, mergeAll, merge} from 'rxjs/operators';
import { Validators, FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { forbiddenNameValidator } from '../shared/duplicate-name.directive';
import { dbmModel } from '../shared/model/dbmModel';
import { DashboardManagingComponent } from '../dashboard-managing/dashboard-managing.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DynamicDashboardManageDirective } from '../shared/directives/dynamic-dashboard-manage.directive';
import { DashboardSearchingComponent } from '../dashboard-searching/dashboard-searching.component';



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
  

  routerChange$;

  // componentRef: any;

  // @ViewChild(DynamicDashboardManageDirective) dynamicComponentLoader: DynamicDashboardManageDirective;

   private _chooseFeature = 'manage';

  // get chooseFeature(){
  //   console.log('s')
  //   return this._chooseFeature;
  // }
 
  //  set chooseFeature(value) {
  //    this._chooseFeature = value;
  //    this.setDynamicComponent();
  //  }

  mapping = new Map<string, any>(
    [
      ['manage', DashboardManagingComponent],
      ['search', DashboardSearchingComponent]
    ]
  );

  @ViewChild(DashboardManagingComponent) manage: DashboardManagingComponent

  mode: string;
  
  

  currentLocationArray:Array<{id:string,name:string}>;//location path  

 
  constructor( private route: ActivatedRoute, private router: Router ) { //private componenFactoryResolver: ComponentFactoryResolver
    
    this.routerChange$
    = 
    
    this.route.params.subscribe(p => {
      this._chooseFeature = p.feature;
      if(this._chooseFeature == 'manage' && p.location != undefined){
        this.changeFolder(p.location);
      }
    });

  }

  ngOnDestroy(): void {
    if(this.routerChange$ != undefined)
      this.routerChange$.unsubscribe();

  }

  ngOnInit() {
    console.log('on init')
    this.mode = 'indeterminate'
    //this.setDynamicComponent();
      
  }

  changeFolder(destination){
    
    let waitElement = setInterval(() => {
      if(this.manage != undefined){
        // this.router.navigate(
        //   ['dashboardManage', 
        //     { 
        //       feature: 'manage', 
        //       location: destination
        //     }
        //   ]);
        this.manage.changeFolder(destination);
        clearInterval(waitElement);
      }
    },100)

    
      
  }


  ngAfterViewInit(): void {
    //this.setDynamicComponent();
    
  }

  onSearchChange(searchingValue){
    if(searchingValue == ''){
      // this.router.navigate(
      //   ['dashboardManage', 
      //     { 
      //       feature: 'manage', 
      //       location: this.currentLocationArray != undefined && this.currentLocationArray.length > 0 
      //                 ? this.currentLocationArray[this.currentLocationArray.length -1].id
      //                 : 'Root'
      //     }
      //   ]);
    }else{
      this.router.navigate(
        ['dashboardManage', 
          { feature: 'search', 
            location: this.currentLocationArray != undefined && this.currentLocationArray.length > 0 
                      ? this.currentLocationArray[this.currentLocationArray.length -1].id
                      : 'Root'
          }
        ]
      );
    }
  }


  /**
   * 
   * below two method are come from output
   */

  pathArray(e){
    this.currentLocationArray = e;
  }
  
  searchFinish(r){
    this.mode = r;
  }

  /**
   * using directive for creating dynamic component 
   */

  // setDynamicComponent() {
  //   const targetComponent = this.mapping.get(this._chooseFeature);
  //   const componentFactory = this.componenFactoryResolver.resolveComponentFactory(targetComponent);
  //   const viewContainerRef = this.dynamicComponentLoader.viewContainerRef;

  //   viewContainerRef.clear();
  //   this.componentRef = viewContainerRef.createComponent(componentFactory);
  //   // console.log(this.componentRef.instance)
  //   if(this._chooseFeature == 'manage' )
  //     this.componentRef.instance.outputEvent.subscribe(val => this.currentLocationArray = val);
  //   else
  //     this.componentRef.instance.outputEvent.subscribe(val => this.mode = val);
  // }


}
