import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatCheckboxModule } from '@angular/material';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule ,
    MatButtonModule,
    MatCheckboxModule
  ],
  exports:[FormsModule, MatButtonModule,MatCheckboxModule]
})
export class SharedModule { }
