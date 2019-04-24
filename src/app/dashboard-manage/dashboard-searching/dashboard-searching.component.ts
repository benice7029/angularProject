import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-dashboard-searching',
  templateUrl: './dashboard-searching.component.html',
  styleUrls: ['./dashboard-searching.component.scss']
})
export class DashboardSearchingComponent implements OnInit {

  @Output() searchFinish = new EventEmitter();

  mode: string;

  totalData

  finished: boolean = false;

  constructor() { }

  ngOnInit() {
    this.mode = 'indeterminate'

    setTimeout(() => {
      this.mode = 'determinate';
      this.finished = true;
      this.searchFinish.emit('determinate')
    },3000)

    this.totalData = [
      {
        id:'1',
        name:'Folder1',
        type: 'folder',
        editor: 'Ben',
        EDate: '2019/04/10',
        Previous: 'Root',
        Tennant: 'Tennant 1',
        location: 'Root'
      },
      {
        id:'2',
        name:'File1',
        type: 'dashboard',
        editor: 'Ben',
        EDate: '2019/04/10',
        Previous: 'Root',
        Tennant: 'Tennant 1',
        location: 'Root'
      },
      {
        id:'3',
        name:'File2',
        type: 'dashboard',
        editor: 'Ben',
        EDate: '2019/04/10',
        Previous: 'Root',
        Tennant: 'Tennant 1',
        location: 'Root'

      },
      {
        id:'9',
        name:'File98',
        type: 'dashboard',
        editor: 'Ben',
        EDate: '2019/04/10',
        Previous: 'Root',
        Tennant: 'Tennant 1',
        location: 'Root'
      },
      {
        id:'10',
        name:'File14',
        type: 'dashboard',
        editor: 'Ben',
        EDate: '2019/04/10',
        Previous: 'Root',
        Tennant: 'Tennant 1',
        location: 'Root'
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
        Tennant: 'Tennant 1',
        location: 'Root\\Folder1'
      },
      {
        id:'5',
        name:'Folder3',
        type: 'folder',
        editor: 'Ben',
        EDate: '2019/04/10',
        Previous: '1',
        Tennant: 'Tennant 1',
        location: 'Root\\Folder1'
      },
      {
        id:'6',
        name:'File3',
        type: 'dashboard',
        editor: 'Ben',
        EDate: '2019/04/10',
        Previous: '1',
        Tennant: 'Tennant 1',
        location: 'Root\\Folder1'
      },
      {
        id:'7',
        name:'File4',
        type: 'dashboard',
        editor: 'Ben',
        EDate: '2019/04/10',
        Previous: '1',
        Tennant: 'Tennant 1',
        location: 'Root\\Folder1'
      },
      {
        id:'8',
        name:'File5',
        type: 'dashboard',
        editor: 'Ben',
        EDate: '2019/04/10',
        Previous: '1',
        Tennant: 'Tennant 1',
        location: 'Root\\Folder1'
      }
    ]
  }

}
