import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PlayListComponent } from "./plays/play-list/play-list.component";
import { PlayCreateComponent } from "./plays/play-create/play-create.component";
import { LoginComponent } from "./auth/login/login.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { UserInfoCreateComponent } from "./userinfo/userinfo-create/userinfo-create.component";
import { UserInfoListComponent } from "./userinfo/userinfo-list/userinfo-list.component";
import { AuthGuard } from "./auth/auth.guard";

const routes: Routes = [
    {path:'', component: PlayListComponent},
    {path:'create',component:PlayCreateComponent, canActivate:[AuthGuard]},
    //{path:'edit/:playId',component:PlayCreateComponent, canActivate:[AuthGuard]},
    {path:'login',component:LoginComponent},
    {path:'signup',component:SignupComponent},
    {path:'user/:userinfoId', component: UserInfoListComponent},
    {path:'userinfo', component: UserInfoCreateComponent, canActivate:[AuthGuard]}, // Add this lin
    {path:'userinfo/:userinfoId', component: UserInfoCreateComponent, canActivate:[AuthGuard]} // Add this lin
]
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers:[AuthGuard]
})

export class AppRoutingModule{ }