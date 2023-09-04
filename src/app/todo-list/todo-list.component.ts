import { Component, Input } from '@angular/core';

import { Todo } from './../todo.model';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent {
//Declare Variable
/*todos = [
  {title: 'First Post', content:'First Post Content'},
  {title: 'Second Post', content:'Second Post Content'},
];*/
@Input() todos: Todo[] = [];

//Declare Methods
}
