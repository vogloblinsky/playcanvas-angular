import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeComponent } from './home.component';

import { HomePageRoutingModule } from './home-routing.module';

@NgModule({
    imports: [CommonModule, HomePageRoutingModule],
    declarations: [HomeComponent],
})
export class HomePageModule {}
