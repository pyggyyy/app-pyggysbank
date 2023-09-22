import { Component, OnInit, OnDestroy} from '@angular/core';
import { Todo } from './../todo.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {ActivatedRoute, ParamMap} from '@angular/router';

import { TodoService } from '../services/todos.service';
import { mimeType } from './mimi-type.validator';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-todo-create',
  templateUrl: './todo-create.component.html',
  styleUrls: ['./todo-create.component.css']
})
export class TodoCreateComponent implements OnInit, OnDestroy {

  private mode = 'create';
  private todoId: string;
  todo: Todo;
  isLoading = false;

  //Define Form on TS
  form: FormGroup;

  imagePreview: string;

  private authStatusSub: Subscription;

  constructor(public todosService: TodoService, public route: ActivatedRoute, private authSerivce:AuthService){};

  ngOnInit() {
    this.authStatusSub = this.authSerivce.getAuthStatusListener()
    .subscribe(authStatus => {
      this.isLoading = false;
    })
    this.form = new FormGroup({
      'title': new FormControl(null, [Validators.required, Validators.minLength(3)]),
      'content': new FormControl(null, []),
      'image': new FormControl(null, {asyncValidators: [mimeType]})
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
            content:todoData.content,
            imagePath: todoData.imagePath,
            creator:todoData.creator
          }
          this.form.setValue({title:this.todo.title,content:this.todo.content,image:this.todo.imagePath})
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
      this.todosService.addTodo(this.form.value.title,this.form.value.content,this.form.value.image)
    }
    else{
      //Edit
      this.todosService.updateTodo(this.todoId,this.form.value.title, this.form.value.content,this.form.value.image);
    }
    this.form.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
