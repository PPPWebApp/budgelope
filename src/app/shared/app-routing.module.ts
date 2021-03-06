import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from '../core/home/home.component';
import { ErrorComponent } from '../error/error.component';
import { LoginComponent } from '../login/login.component';
import { SignUpComponent } from '../signup/signup.component';
import { AccountListComponent } from '../accounts/account-list/account-list.component';
import { AccountComponent } from '../accounts/account/account.component';
import { AuthGuardService } from './auth-guard.service';

import { BudgetviewComponent } from '../budgets/budgetview/budgetview.component';
import { TransactionComponent } from '../transactions/transaction/transaction.component';
import { TransactionsComponent } from '../transactions/transactions.component';
import { CategoriesComponent } from '../categories/categories.component';
import { CategoryComponent } from '../categories/category/category.component';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'app', component: HomeComponent, canActivate: [AuthGuardService], children: [
      { path: "budget", component: BudgetviewComponent },
      { path: "budget/:month", component: BudgetviewComponent },
      { path: 'transactions/:id', component: TransactionsComponent },
      { path: 'transactions', component: TransactionsComponent },
      { path: 'accounts', component: AccountListComponent },
      { path: 'account/:id', component: AccountComponent },
      { path: 'categories', component: CategoriesComponent },
      { path: 'category/:id', component: CategoryComponent },
    ]
  },
  { path: 'signup', component: SignUpComponent },
  { path: '**', component: ErrorComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot( appRoutes )
  ],
  exports: [
    RouterModule
  ]
})

export class AppRoutingModule { }
