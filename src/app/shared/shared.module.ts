import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatCheckboxModule, MatInputModule, MatIconModule, MatMenuModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule ,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    MatIconModule,
    MatMenuModule
    
  ],
  exports:[
    FormsModule,
    ReactiveFormsModule, 
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    MatIconModule,
    MatMenuModule]
})
export class SharedModule { }
