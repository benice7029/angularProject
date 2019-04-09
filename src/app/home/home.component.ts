import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { fromEvent } from 'rxjs';
import { SharedServiceService } from '../services/shared-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [SharedServiceService]
})
export class HomeComponent implements OnInit,AfterViewInit {

  @ViewChild('btn') btn: ElementRef;

  @ViewChild('title') title: ElementRef;

  @ViewChild('container') container:ElementRef;


  private click;

  constructor(private shardService: SharedServiceService) { }

  ngOnInit() {
    this.shardService.putData('a');
    console.log(this.shardService.getDatas());
  }

  ngAfterViewInit(): void {
    this.click = fromEvent(this.btn.nativeElement,'click');
    this.click.subscribe(() => {
      this.title.nativeElement.style.color = 'red'
    });
    
  }

}
