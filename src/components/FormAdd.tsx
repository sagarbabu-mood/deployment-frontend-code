import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { addTodo } from "../redux/slice/todoSlice";

const FormAdd: React.FC = () => {
  const [todo, setTodo] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('https://terranxt-backend.onrender.com/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: todo }),
      });
      if (!response.ok) {
        throw new Error('Failed to create todo');
      }
      const newTodo = await response.json();
      dispatch(addTodo(newTodo));
      setTodo('');
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error creating todo:', error.message);
      } else {
        console.error('Unknown error:', error);
      }
    }
  };

  return (
    <div>
      <h1 className="heading">Create task</h1>
    <Form onSubmit={handleSubmit} className="mb-4">
      <div className="d-flex">
        <Form.Group style={{ flex: "1" }}>
          <Form.Control
            required
            placeholder="Add Todo"
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="ms-2">
          <Button type="submit">ADD</Button>
        </Form.Group>
      </div>
    </Form>
    </div>
  );
};

export default FormAdd;
