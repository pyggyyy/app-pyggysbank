import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TodoListComponent } from "./todo-list/todo-list.component";
import { TodoCreateComponent } from "./todo-create/todo-create.component";
import { LoginComponent } from "./auth/login/login.component";
import { SignupComponent } from "./auth/signup/signup.component";

const routes: Routes = [
    {path:'', component: TodoListComponent},
    {path:'create',component:TodoCreateComponent},
    {path:'edit/:todoId',component:TodoCreateComponent},
    {path:'login',component:LoginComponent},
    {path:'signup',component:SignupComponent},
]
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule{ }