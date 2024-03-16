
import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { addTodo } from "../redux/slice/todoSlice"; // Import addTodo action

const FormAdd: React.FC = () => {
  const [todo, setTodo] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => { // Define handleSubmit as an async function
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: todo }), // Pass the todo value as name property
      });
      if (!response.ok) {
        throw new Error('Failed to create todo');
      }
      const newTodo = await response.json();
      dispatch(addTodo(newTodo)); // Dispatch addTodo action upon successful creation
      setTodo(''); // Clear the input field after submission
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error creating todo:', error.message); // Corrected error message
      } else {
        console.error('Unknown error:', error);
      }
    }
    
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-4">
      <div className="d-flex">
        <Form.Group style={{ width: "100%" }}>
          <Form.Control
            required
            placeholder="Add Todo"
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="ms-2">
          <Button type="submit">Submit</Button>
        </Form.Group>
      </div>
    </Form>
  );
};

export default FormAdd;
