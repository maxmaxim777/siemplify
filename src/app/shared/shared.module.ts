import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {GeneralSelectComponent} from './components/general-select/general-select.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    GeneralSelectComponent
  ],
  exports: [
    CommonModule,
    GeneralSelectComponent
  ]

})
export class SharedModule {
}
