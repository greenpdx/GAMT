import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BudgetComponent } from './budget/budget.component';
import { AuthorsComponent } from './authors/authors.component';
import { TNVInfoComponent } from './tnvinfo/tnvinfo.component';

const routes: Routes = [
    { path: '', redirectTo: '3D', pathMatch: 'full'},
    { path: 'budget', component: BudgetComponent },
    { path: 'authors', component: AuthorsComponent },
    { path: 'tnvinfo', component: TNVInfoComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
