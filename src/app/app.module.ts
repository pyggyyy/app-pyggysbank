import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http'



import { AppComponent } from './app.component';
import { TodoCreateComponent } from './todos/todo-create/todo-create.component';
import { HeaderComponent } from './header/header.component';
import { TodoListComponent } from './todos/todo-list/todo-list.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthInterceptor } from './auth/auth-interceptor';
import { ErrorInterceptor } from './error-interceptor';
import { ErrorComponent } from './error/error.component';
import { UserInfoCreateComponent } from './userinfo/userinfo-create/userinfo-create.component';
import { PlayCreateComponent } from './plays/play-create/play-create.component';
import { PlayListComponent } from './plays/play-list/play-list.component';
//Add Materials Module
import { AngularMaterialModule } from './angular-materials.module';


@NgModule({
  declarations: [
    AppComponent,
    TodoCreateComponent,
    HeaderComponent,
    TodoListComponent,
    LoginComponent,
    SignupComponent,
    ErrorComponent,
    UserInfoCreateComponent,
    PlayCreateComponent,
    PlayListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AngularMaterialModule
  ],
  providers: [
    {provide:HTTP_INTERCEPTORS,useClass: AuthInterceptor, multi:true},
    {provide:HTTP_INTERCEPTORS,useClass: ErrorInterceptor, multi:true}
  ],
  bootstrap: [AppComponent],
  //entryComponents:[ErrorComponent]
})
export class AppModule { }
