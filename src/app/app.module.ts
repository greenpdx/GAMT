import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { DataService } from './data-service.service';

import { Three3dComponent } from './budget/three3d.component';
import { SlideComponent } from './budget/slide.component';
import { BudgetComponent } from './budget/budget.component';
import { TreeGridComponent } from './budget/tree-grid.component';
import { TreeModule } from 'angular2-tree-component';
import { AuthorsComponent } from './authors/authors.component';
import { AuthorComponent } from './authors/author.component';
import { TNVInfoComponent } from './tnvinfo/tnvinfo.component';


@NgModule({
  declarations: [
    AppComponent,
    Three3dComponent,
    SlideComponent,
    TreeGridComponent,
    AuthorsComponent,
    TNVInfoComponent,
    AuthorComponent,
    BudgetComponent
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
