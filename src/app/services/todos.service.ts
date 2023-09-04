//Get Model
import {Todo} from './../todo.model';

export class TodoService {
    private todos: Todo[] = [];

    getTodos() {
        return this.todos;
    }

    addTodo(title:string, content:string){
        const todo: Todo = {
            title:title,
            content:content
        }
        this.todos.push(todo);
    }
}