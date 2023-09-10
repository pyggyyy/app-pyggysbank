import { Component, OnInit, OnDestroy } from '@angular/core';
import {Subscription} from 'rxjs';

import { Todo } from './../todo.model';

//Import Service
import { TodoService } from '../services/todos.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit, OnDestroy {
  //Declare Variable
  todos: Todo[] = [];
  isLoading = false;
  private todosSub: Subscription

  constructor(public todosService: TodoService){};

  ngOnInit() {
    this.isLoading = true;
    this.todosService.getTodos();
    this.todosSub = this.todosService.getTodoUpdateListener()
    .subscribe((todos: Todo[]) => {
      this.isLoading = false;
      this.todos = todos;
    });
  }

  onDelete(todoId: string){
    this.todosService.deleteTodo(todoId);
  }

  ngOnDestroy() {
    this.todosSub.unsubscribe();
  }
}
