import { Component, OnInit, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard-file',
  templateUrl: './dashboard-file.component.html',
  styleUrls: ['./dashboard-file.component.scss']
})
export class DashboardFileComponent implements OnInit {

  @Input('fileName') fileName:string;

  fileNameFormControl = new FormControl('', [
    Validators.required
  ]);

  canEdit: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  edit(){
    if(!this.canEdit){
    }else{
      if(this.fileName.trim() == '')
        return false;
      /**
       * Http remind!
       * should send request here for updating folder name
       */
    }
    
    this.canEdit = !this.canEdit;
  }

}
