import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard-file',
  templateUrl: './dashboard-file.component.html',
  styleUrls: ['./dashboard-file.component.scss']
})
export class DashboardFileComponent implements OnInit {

  @Input('fileName') fileName:string;


  constructor() { }

  ngOnInit() {
  }

}
