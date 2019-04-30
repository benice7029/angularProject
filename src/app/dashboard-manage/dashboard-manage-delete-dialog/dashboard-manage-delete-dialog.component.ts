import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { DashboardManageService } from '../shared/service/dashboard-manage.service';
import { dbmModel } from '../shared/model/dbmModel';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-manage-delete-dialog',
  templateUrl: './dashboard-manage-delete-dialog.component.html',
  styleUrls: ['./dashboard-manage-delete-dialog.component.scss']
})
export class DashboardManageDeleteDialogComponent implements OnInit {

  _chooseFeature: string;

  currentLocation: string;

  deleteFolders: Array<dbmModel>;

  deleteDashboards: Array<dbmModel>;

  constructor(
    private router: Router,
    private dashboardManageService: DashboardManageService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<DashboardManageDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      delFolders: Array<dbmModel>,
      delDashboards: Array<dbmModel>,
      route: ActivatedRoute
    }) {
    this.deleteFolders = data.delFolders;
    this.deleteDashboards = data.delDashboards;
    console.log(this.deleteDashboards)

    data.route.params.subscribe(p => {
      this._chooseFeature = p.feature;
      if (this._chooseFeature == 'manage' && p.location != undefined) {
        this.currentLocation = p.location;

      }
    });
  }

  ngOnInit() {
  }

  onYesClick(): void {

    this.dashboardManageService
      .removeDashboardManageData([...this.deleteFolders, ...this.deleteDashboards])
      .subscribe((result) => {
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
      });

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
