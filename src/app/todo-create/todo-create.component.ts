import { Component, EventEmitter, Output } from '@angular/core';
import { Todo } from './../todo.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-todo-create',
  templateUrl: './todo-create.component.html',
  styleUrls: ['./todo-create.component.css']
})
export class TodoCreateComponent {
  //property
  enterredTitle = '';
  enterredContent = '';
  @Output() todoCreated = new EventEmitter<Todo>();


  //method
  onCreate(form:NgForm) {
    if(form.invalid){
      return;
    }
    const todo: Todo = {
      title: form.value.title,
      content: form.value.content
    }
    this.todoCreated.emit(todo);
  }
}
