import { Component } from '@angular/core';

import { Todo } from './todo.model'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app-pyggysbank';
  storedTodos: Todo[] = [];

  onTodoAdded(todo){
    this.storedTodos.push(todo)
  }
}
