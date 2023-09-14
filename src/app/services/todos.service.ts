//Get Model
import { Injectable } from '@angular/core';
import {Todo} from './../todo.model';
import {HttpClient} from '@angular/common/http'
import { Subject } from 'rxjs';
import {map} from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class TodoService {
    private todos: Todo[] = [];
    private todosUpdated = new Subject<{todos: Todo[], todoCount: number}>();

    constructor(private http: HttpClient, private router: Router) {

    }

    getTodos(todosPerPage: number, currentPage: number) {
        const queryParams = `?pagesize=${todosPerPage}&page=${currentPage}`;
        this.http.get<{message: string,todos:any,maxTodos: number}>('http://localhost:3000/api/todos' + queryParams)
        .pipe(map((todoData) => {
            return {todos: todoData.todos.map(todo => {
                return{
                    title: todo.title,
                    content: todo.content,
                    id: todo._id,
                    imagePath: todo.imagePath
                }
            }), maxTodos: todoData.maxTodos}
        }))
        .subscribe((transformedTodosData) => {
            this.todos = transformedTodosData.todos;
            this.todosUpdated.next({todos: [...this.todos],todoCount:transformedTodosData.maxTodos});
        });
    }

    getTodoUpdateListener() {
        return this.todosUpdated.asObservable()
    }

    getTodo(id: string){
        return this.http.get<{_id:string, title:string,content:string, imagePath: string}>('http://localhost:3000/api/todos/'+ id);
    }

    addTodo(title:string, content:string, image: File){
        const todoData = new FormData();
        todoData.append('title', title);
        if(content){
            todoData.append('content', content);
        }
        if(image){
            todoData.append('image', image, title);
        }
        this.http.post<{message:string, todo: Todo}>('http://localhost:3000/api/todos',todoData)
        .subscribe(responseData => {
            this.router.navigate(['/']);
        });
    }

    updateTodo(id: string, title: string, content: string, image: File | string){
        let todoData: Todo | FormData;
        if(typeof(image) === 'object'){
            todoData = new FormData();
            todoData.append('id',id);
            todoData.append('title',title);
            todoData.append('content',content);
            todoData.append('image',image, title);
        }
        else{
            todoData = {
                id:id,
                title: title,
                content:content,
                imagePath:image as string
            }
        }
        this.http.put('http://localhost:3000/api/todos/'+ id, todoData)
        .subscribe(response => {
            this.router.navigate(['/']);
        });
    }

    deleteTodo(todoId: string) {
        return this.http.delete('http://localhost:3000/api/todos/'+todoId)
        
    }
}