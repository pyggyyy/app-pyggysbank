import { Component, OnInit } from '@angular/core';
import { Todo } from './../todo.model';
import { NgForm } from '@angular/forms';
import {ActivatedRoute, ParamMap} from '@angular/router';

import { TodoService } from '../services/todos.service';

@Component({
  selector: 'app-todo-create',
  templateUrl: './todo-create.component.html',
  styleUrls: ['./todo-create.component.css']
})
export class TodoCreateComponent implements OnInit {

  constructor(public todosService: TodoService, public route: ActivatedRoute){};

  private mode = 'create';
  private todoId: string;
  todo: Todo;
  isLoading = false;

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('todoId')){
        this.mode = 'edit';
        this.todoId = paramMap.get('todoId');
        this.isLoading = true;
        this.todosService.getTodo(this.todoId).subscribe(todoData => {
          this.isLoading = false;
          this.todo = {
            id:todoData._id,
            title:todoData.title,
            content:todoData.content
          }
        })
      }
      else{
        this.mode = 'create';
        this.todoId = null;
      }
    });
  }


  //method
  onCreate(form:NgForm) {
    if(form.invalid){
      return;
    }
    this.isLoading = true;
    if(this.mode === 'create'){
      const todo: Todo = {
        id: null,
        title: form.value.title,
        content: form.value.content
      }
      this.todosService.addTodo(todo.title,todo.content)
    }
    else{
      //Edit
      const todo: Todo = {
        id: this.todoId,
        title: form.value.title,
        content: form.value.content
      }
      this.todosService.updateTodo(todo.id,todo.title,todo.content);
    }
    form.resetForm();
  }
}
