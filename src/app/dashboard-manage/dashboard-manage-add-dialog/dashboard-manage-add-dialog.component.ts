import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material';
import { AddDashboardManagementData } from '../shared/model/AddDashboardManagementData';
import { DashboardManageService } from '../shared/service/dashboard-manage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { dbmModel } from '../shared/model/dbmModel';

@Component({
  selector: 'app-dashboard-manage-add-dialog',
  templateUrl: './dashboard-manage-add-dialog.component.html',
  styleUrls: ['./dashboard-manage-add-dialog.component.scss']
})
export class DashboardManageAddDialogComponent implements OnInit {

  _chooseFeature: string;

  currentLocation: string;

  durationInSeconds = 5;

  folders: Array<dbmModel>;

  type = ['folder', 'dashboard'];

  newData: AddDashboardManagementData;

  constructor(
    private router: Router,
    private dashboardManageService: DashboardManageService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<DashboardManageAddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { newData: AddDashboardManagementData, route: ActivatedRoute }) {
    this.newData = data.newData;
    console.log(this.newData)
    //folders should query from backend
    

    data.route.params.subscribe(p => {
      this._chooseFeature = p.feature;
      if (this._chooseFeature == 'manage' && p.location != undefined) {
        this.currentLocation = p.location;

      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {

    this.dashboardManageService
      .addDashboardManageData(this.newData)
      .subscribe((result) => {
        this.openSnackBar(result.msg);
        console.log(this._chooseFeature + ", " + this.currentLocation)
        if (this._chooseFeature == 'manage' && this.currentLocation != undefined) {
          console.log('navi..')
          this.router.navigate(
            ['dashboardManage',
              {
                feature: this._chooseFeature,
                location: this.currentLocation
              }
            ]);
        }

        // use afterclose to re get current folder's data
        if (result.msg == 'success' && this._chooseFeature == 'manage' && this.currentLocation != undefined) {
          this.dialogRef.afterClosed();
          this.dialogRef.close();
        } else {
          this.dialogRef.close();
        }



      })


  }

  openSnackBar(msg: string): void {
    this.snackBar.openFromComponent(SuccessComponent, {
      duration: this.durationInSeconds * 1000,
      horizontalPosition: 'center',
      panelClass: 'center',
      data: msg
    });
  }

  ngOnInit() {

    this.dashboardManageService.getExistedFolders()
      .subscribe((folders) => {
        this.folders = folders;
        this.folders.push(
          {
            id: 0,
            name: 'Root',
            type: '',
            editor: '',
            lastModified: '',
            previous: '',
            tennant: ''
          }
        );

        console.log(this.folders)

      })



  }

}


@Component({
  selector: 'snack-bar-component-example-snack',
  template:
    ` <span class="create-success">
        Create {{data}}
      </span>`
  ,
  styles: [`
    .create-success {
      color: default;
    }
    
  `],
})
export class SuccessComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) { }
}