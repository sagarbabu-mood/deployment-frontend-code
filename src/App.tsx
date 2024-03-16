
import React, { useEffect, useState } from "react";
import { Button, Container, Modal, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import "./App.css"

import FormAdd from "./components/FormAdd";
import TodoItem from "./components/TodoItem";

import { removeTodo, setTodos } from "./redux/slice/todoSlice";



const App: React.FC = () => {
  const dispatch = useDispatch();
  const todoList = useSelector((state: any) => state.todo.list);

  // State for tracking the ID of the todo to be deleted and whether the confirmation modal is shown
  const [deleteTodoId, setDeleteTodoId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Function to show the delete confirmation modal and set the ID of the todo to be deleted
  const handleShowDeleteModal = (id: number) => {
    setDeleteTodoId(id);
    setShowDeleteModal(true);
  };

  // Function to hide the delete confirmation modal
  const handleCloseDeleteModal = () => {
    setDeleteTodoId(null);
    setShowDeleteModal(false);
  };

  // Function to handle delete confirmation
  const handleConfirmDelete = async () => { // Define handleConfirmDelete as an async function
    if (deleteTodoId !== null) {
      try {
        const response = await fetch(`https://terranxt-backend.onrender.com/api/todos/${deleteTodoId}`, { // Use deleteTodoId instead of id
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete todo');
        }
        dispatch(removeTodo({ id: deleteTodoId })); // Dispatch removeTodo with deleteTodoId
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error deleting todo:', error.message);
        } else {
          console.error('Unknown error:', error);
        }
      }
      setDeleteTodoId(null);
      setShowDeleteModal(false);
    }
  };
  
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://terranxt-assignment.onrender.com/api/todos');
        if (!response.ok) {
          throw new Error('Failed to fetch todos');
        }
        const todos = await response.json();
        dispatch(setTodos(todos));
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error fetching todos:', error.message);
        } else {
          console.error('Unknown error:', error);
        }
      }
    };

    fetchData();
  }, [dispatch]);

  return (
    <div className="App d-flex justify-content-center align-items-center mt-3 ">
      <Container>
        <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
          <Modal.Header closeButton>
            <Modal.Title>Remove todo?</Modal.Title>
          </Modal.Header>
          <Modal.Body>Do you really want to delete it?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDeleteModal}>
              Close
            </Button>
            <Button variant="primary" onClick={handleConfirmDelete}>
              OK
            </Button>
          </Modal.Footer>
        </Modal>
        <FormAdd />
        <h1 className="title">Todo App</h1>
        <Table striped hover bordered style={{ textAlign: "center", verticalAlign: "middle" }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th colSpan={2}>Action</th>
            </tr>
          </thead>
          <tbody>
            {todoList.map((todo: any) => (
              <TodoItem
                key={todo.id}
                id={todo.id}
                name={todo.name}
                isDone={todo.isDone}
                createdAt={todo.createdAt}
                updatedAt={todo.updatedAt}
                onClickRemove={handleShowDeleteModal} // Pass the function to show the delete confirmation modal
              />
            ))}
          </tbody>
        </Table>
      </Container>
    </div>
  );
};

export default App;
