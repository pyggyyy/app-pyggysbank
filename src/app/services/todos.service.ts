//Get Model
import {Todo} from './../todo.model';
import { Subject } from 'rxjs';

export class TodoService {
    private todos: Todo[] = [];
    private todosUpdated = new Subject<Todo[]>();

    getTodos() {
        return [...this.todos];
    }

    getTodoUpdateListener() {
        return this.todosUpdated.asObservable()
    }

    addTodo(title:string, content:string){
        const todo: Todo = {
            title:title,
            content:content
        }
        this.todos.push(todo);
        this.todosUpdated.next([...this.todos])
    }
}