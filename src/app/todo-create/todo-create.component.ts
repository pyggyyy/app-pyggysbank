import { Component } from '@angular/core';
import { Todo } from './../todo.model';
import { NgForm } from '@angular/forms';

import { TodoService } from '../services/todos.service';

@Component({
  selector: 'app-todo-create',
  templateUrl: './todo-create.component.html',
  styleUrls: ['./todo-create.component.css']
})
export class TodoCreateComponent {
  //property
  enterredTitle = '';
  enterredContent = '';
  

  constructor(public todosService: TodoService){};


  //method
  onCreate(form:NgForm) {
    if(form.invalid){
      return;
    }
    const todo: Todo = {
      title: form.value.title,
      content: form.value.content
    }
    this.todosService.addTodo(todo.title,todo.content)
  }
}
