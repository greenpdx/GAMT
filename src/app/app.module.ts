import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { Three3dComponent } from './three3d.component';
import { DataService } from './data-service.service';
import { SlideComponent } from './slide.component';
import { TreeModule } from 'angular-tree-component';
import { TreeGridComponent } from './tree-grid.component';


@NgModule({
  declarations: [
    AppComponent,
    Three3dComponent,
    SlideComponent,
    TreeGridComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    TreeModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
