import { Component, OnInit } from '@angular/core';
import { Todo } from './../todo.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {ActivatedRoute, ParamMap} from '@angular/router';

import { TodoService } from '../services/todos.service';

@Component({
  selector: 'app-todo-create',
  templateUrl: './todo-create.component.html',
  styleUrls: ['./todo-create.component.css']
})
export class TodoCreateComponent implements OnInit {

  private mode = 'create';
  private todoId: string;
  todo: Todo;
  isLoading = false;

  //Define Form on TS
  form: FormGroup;

  imagePreview: string;

  constructor(public todosService: TodoService, public route: ActivatedRoute){};

  ngOnInit() {
    this.form = new FormGroup({
      'title': new FormControl(null, [Validators.required, Validators.minLength(3)]),
      'content': new FormControl(null, [Validators.required]),
      'image': new FormControl(null, {validators:[Validators.required]})
    });
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
          this.form.setValue({title:this.todo.title,content:this.todo.content})
        })
      }
      else{
        this.mode = 'create';
        this.todoId = null;
      }
    });
  }

  //Image Upload Method
  onImagePicked(event:Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image:file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    }
    reader.readAsDataURL(file);
  }

  //method
  onCreate() {
    if(this.form.invalid){
      return;
    }
    this.isLoading = true;
    if(this.mode === 'create'){
      const todo: Todo = {
        id: null,
        title: this.form.value.title,
        content: this.form.value.content
      }
      this.todosService.addTodo(todo.title,todo.content)
    }
    else{
      //Edit
      const todo: Todo = {
        id: this.todoId,
        title: this.form.value.title,
        content: this.form.value.content
      }
      this.todosService.updateTodo(todo.id,todo.title,todo.content);
    }
    this.form.reset();
  }
}
