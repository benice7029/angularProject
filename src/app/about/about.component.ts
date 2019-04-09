import { Component, OnInit } from '@angular/core';
import { SharedServiceService } from '../services/shared-service.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  constructor(private shardService: SharedServiceService) { }

  ngOnInit() {
    this.shardService.putData('b');
    console.log(this.shardService.getDatas());
  }

}
