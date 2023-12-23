import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {RegisterComponent} from "./components/register/register.component";
import {LayoutComponent} from "./components/layout/layout.component";
import {ListsComponent} from "./components/layout/lists/lists.component";
import {DetailsComponent} from "./components/layout/lists/details/details.component";
import {UsersComponent} from "./components/layout/users/users.component";

const routes: Routes = [ {
  path: '',
  pathMatch: 'full',
  redirectTo: '/login'
},
  {
    component: LoginComponent,
    path: 'login',
  },
  {
    component: RegisterComponent,
    path: 'register',
  },
  {
    component: LayoutComponent,
    path: 'layout',
    children: [
      { path: '',
        pathMatch: 'full',
        redirectTo: 'lists'},
      {
        component: ListsComponent,
        path: 'lists',
      },
      {
        component: DetailsComponent,
        path: 'lists/details/:id',
      },
      {
        component: UsersComponent,
        path: 'users',
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
