import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { fromEvent } from 'rxjs';
import { ColorfulDirective } from './Directives/colorful.directive';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit{
  
  @ViewChild('content') content:ElementRef;

  private toTop: boolean = true;

  ngAfterViewInit(): void {
    fromEvent(document,'scroll')
    .subscribe(
      (e) => {
        if(this.content.nativeElement.getBoundingClientRect().top == 0)
          this.toTop = true;
        else
          this.toTop = false;
        
        
      }
    )
  }
}
