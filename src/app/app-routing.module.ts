import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TodoListComponent } from "./todo-list/todo-list.component";
import { TodoCreateComponent } from "./todo-create/todo-create.component";

const routes: Routes = [
    {path:'', component: TodoListComponent},
    {path:'create',component:TodoCreateComponent},
    {path:'edit/:todoId',component:TodoCreateComponent},
]
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule{ }