import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appDynamicDashboardManage]'
})
export class DynamicDashboardManageDirective {

  public viewContainerRef = this._viewContainerRef;
  constructor(private _viewContainerRef: ViewContainerRef) { }

}
