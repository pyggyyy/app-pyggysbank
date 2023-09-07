//Get Model
import { Injectable } from '@angular/core';
import {Todo} from './../todo.model';
import {HttpClient} from '@angular/common/http'
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class TodoService {
    private todos: Todo[] = [];
    private todosUpdated = new Subject<Todo[]>();

    constructor(private http: HttpClient) {

    }

    getTodos() {
        this.http.get<{message: string,todos:Todo[]}>('http://localhost:3000/api/posts')
        .subscribe((todoData) => {
            this.todos = todoData.todos;
            this.todosUpdated.next([...this.todos]);
        });
    }

    getTodoUpdateListener() {
        return this.todosUpdated.asObservable()
    }

    addTodo(title:string, content:string){
        const todo: Todo = {
            id:null,
            title:title,
            content:content
        }
        this.todos.push(todo);
        this.todosUpdated.next([...this.todos])
    }
}