import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {Subscription} from 'rxjs';

import { Todo } from './../todo.model';

//Import Service
import { TodoService } from '../../services/todos.service';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { AuthService } from '../../auth/auth.service';

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
  userId: string;
  private todosSub: Subscription;
  private authStatusSub: Subscription;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public todosService: TodoService, private authService: AuthService){};

  ngOnInit() {
    this.isLoading = true;
    this.todosService.getTodos(this.todosPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.todosSub = this.todosService.getTodoUpdateListener()
    .subscribe((todosData: { todos: Todo[], todoCount: number }) => {
      this.isLoading = false;
      this.totalTodos = todosData.todoCount; // Update totalTodos here
      this.todos = todosData.todos;
    });
    this.userIsAuthenticated = this.authService.getIsAuth();
    //Set Subscription Listener for Authorizatoin
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    });
  }

  onChangedPage(pageData: PageEvent){
    this.isLoading = true;
    this.currentPage=pageData.pageIndex + 1;
    this.todosPerPage = pageData.pageSize;
    this.todosService.getTodos(this.todosPerPage,this.currentPage);
  }

  onDelete(todoId: string) {
    this.isLoading = true;
    this.todosService.deleteTodo(todoId).subscribe(() => {
      if (this.todos.length === 1 && this.totalTodos > 1) {
        this.currentPage--;
      }
      this.todosService.getTodos(this.todosPerPage, this.currentPage);
      
      // Manually update the paginator's length property
      this.paginator.length = this.totalTodos;
    },() => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.todosSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
