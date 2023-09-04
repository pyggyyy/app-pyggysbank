import { Component, Input, OnInit } from '@angular/core';

import { Todo } from './../todo.model';

//Import Service
import { TodoService } from '../services/todos.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {
//Declare Variable
/*todos = [
  {title: 'First Post', content:'First Post Content'},
  {title: 'Second Post', content:'Second Post Content'},
];*/
  todos: Todo[] = [];

  constructor(public todosService: TodoService){};

  ngOnInit() {
    this.todos = this.todosService.getTodos();
  }
}
