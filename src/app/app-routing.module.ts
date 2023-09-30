import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TodoListComponent } from "./todos/todo-list/todo-list.component";
import { TodoCreateComponent } from "./todos/todo-create/todo-create.component";
import { LoginComponent } from "./auth/login/login.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { UserInfoCreateComponent } from "./userinfo/userinfo-create/userinfo-create.component";
import { AuthGuard } from "./auth/auth.guard";

const routes: Routes = [
    {path:'', component: TodoListComponent},
    {path:'create',component:TodoCreateComponent, canActivate:[AuthGuard]},
    {path:'edit/:todoId',component:TodoCreateComponent, canActivate:[AuthGuard]},
    {path:'login',component:LoginComponent},
    {path:'signup',component:SignupComponent},
    {path:'userinfo', component: UserInfoCreateComponent, canActivate:[AuthGuard]}, // Add this lin
    {path:'userinfo/:userinfoId', component: UserInfoCreateComponent, canActivate:[AuthGuard]} // Add this lin
]
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers:[AuthGuard]
})

export class AppRoutingModule{ }