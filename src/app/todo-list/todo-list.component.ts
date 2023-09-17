import { Component, OnInit, OnDestroy } from '@angular/core';
import {Subscription} from 'rxjs';

import { Todo } from './../todo.model';

//Import Service
import { TodoService } from '../services/todos.service';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit, OnDestroy {
  //Declare Variable
  todos: Todo[] = [];
  isLoading = false;
  totalTodos = 0;
  todosPerPage = 5;
  currentPage = 1;
  todoSizeOptions = [2,5,10];
  userIsAuthenticated = false;
  private todosSub: Subscription;
  private authStatusSub: Subscription;

  constructor(public todosService: TodoService, private authService: AuthService){};

  ngOnInit() {
    this.isLoading = true;
    this.todosService.getTodos(this.todosPerPage,this.currentPage);
    this.todosSub = this.todosService.getTodoUpdateListener()
    .subscribe((todosData: {todos: Todo[], todoCount: number}) => {
      this.isLoading = false;
      this.totalTodos = todosData.todoCount;
      this.todos = todosData.todos;
    });
    this.userIsAuthenticated = this.authService.getIsAuth();
    //Set Subscription Listener for Authorizatoin
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    });
  }

  onChangedPage(pageData: PageEvent){
    this.isLoading = true;
    this.currentPage=pageData.pageIndex + 1;
    this.todosPerPage = pageData.pageSize;
    this.todosService.getTodos(this.todosPerPage,this.currentPage);
  }

  onDelete(todoId: string){
    this.isLoading = true;
    this.todosService.deleteTodo(todoId).subscribe(() => {
      this.todosService.getTodos(this.todosPerPage,this.currentPage);
    });
  }

  ngOnDestroy() {
    this.todosSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
