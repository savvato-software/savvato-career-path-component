import {ModuleWithProviders, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { SavvatoCareerpathComponentComponent } from './savvato-careerpath-component.component';
import {SavvatoJavascriptServicesModule} from "@savvato-software/savvato-javascript-services";
import {ModelService} from "./_services/model.service";



@NgModule({
  declarations: [SavvatoCareerpathComponentComponent],
  imports: [
  	IonicModule.forRoot(),
  	CommonModule,
  	HttpClientModule,
  	FormsModule,
    SavvatoJavascriptServicesModule
  ],
  exports: [SavvatoCareerpathComponentComponent],
  providers: [ModelService]
})
export class SavvatoCareerpathComponentModule {
  static forRoot(): ModuleWithProviders<NgModule> {
    return {
      ngModule: SavvatoJavascriptServicesModule,
      providers: [
        ModelService
      ]
    }
  }
}
