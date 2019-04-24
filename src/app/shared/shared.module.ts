import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatCheckboxModule, MatInputModule, MatIconModule, MatMenuModule, MatTabsModule, MatAutocompleteModule, MatProgressBarModule, MatListModule, MatProgressSpinnerModule } from '@angular/material';
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
    MatMenuModule,
    MatTabsModule,
    MatAutocompleteModule,
    MatProgressBarModule,
    MatListModule,
    MatProgressSpinnerModule
    
  ],
  exports:[
    FormsModule,
    ReactiveFormsModule, 
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    MatIconModule,
    MatMenuModule,
    MatTabsModule,
    MatAutocompleteModule,
    MatProgressBarModule,
    MatListModule,
    MatProgressSpinnerModule
  ]
})
export class SharedModule { }
