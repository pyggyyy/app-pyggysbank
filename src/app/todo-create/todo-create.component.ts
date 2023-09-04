import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-todo-create',
  templateUrl: './todo-create.component.html',
  styleUrls: ['./todo-create.component.css']
})
export class TodoCreateComponent {
  //property
  enterredTitle = '';
  enterredContent = '';
  @Output() todoCreated = new EventEmitter();


  //method
  onCreate() {
    const todo = {
      title: this.enterredTitle,
      content: this.enterredContent
    }
    this.todoCreated.emit(todo);
  }
}
