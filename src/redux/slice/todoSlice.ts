
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface Todo {
  id: number;
  name: string;
  isDone: boolean;
  createdAt: string;
  updatedAt?: string;
 
}

interface TodoState {
  list: Todo[];
}

const initialState: TodoState = {
  list: [],
};

const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    setTodos(state, action: PayloadAction<Todo[]>) {
      state.list = action.payload;
    },
    addTodo(state, action: PayloadAction<Todo>) {
      state.list.push(action.payload);
    },
    removeTodo(state, action: PayloadAction<{ id: number }>) {
      state.list = state.list.filter(todo => todo.id !== action.payload.id);
    },
    updateStatus(state, action: PayloadAction<{ id: number }>) {
      const updatedAt = new Date().toLocaleString();
      state.list = state.list.map(todo =>
        todo.id === action.payload.id ? { ...todo, isDone: true, updatedAt } : todo
      );
    },
  },
});

export const { setTodos, addTodo, removeTodo, updateStatus } = todoSlice.actions;

export default todoSlice.reducer;
