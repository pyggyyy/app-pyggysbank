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
  private todosSub: Subscription

  constructor(public todosService: TodoService){};

  ngOnInit() {
    this.todos = this.todosService.getTodos();
    this.todosSub = this.todosService.getTodoUpdateListener()
    .subscribe((todos: Todo[]) => {
      this.todos = todos;
    });
  }

  ngOnDestroy() {
    this.todosSub.unsubscribe();
  }
}
