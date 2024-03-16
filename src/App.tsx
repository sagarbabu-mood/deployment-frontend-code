import React, { useEffect, useState } from "react";
import { Button, Container, Modal, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { CircleLoader } from "react-spinners";
import "./App.css";

import FormAdd from "./components/FormAdd";
import TodoItem from "./components/TodoItem";

import { removeTodo, setTodos } from "./redux/slice/todoSlice";

const App: React.FC = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const todoList = useSelector((state: any) => state.todo.list);

  const [deleteTodoId, setDeleteTodoId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleShowDeleteModal = (id: number) => {
    setDeleteTodoId(id);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteTodoId(null);
    setShowDeleteModal(false);
  };

  const handleConfirmDelete = async () => {
    if (deleteTodoId !== null) {
      try {
        const response = await fetch(`https://terranxt-backend.onrender.com/api/todos/${deleteTodoId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete todo');
        }
        dispatch(removeTodo({ id: deleteTodoId }));
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
        const response = await fetch('https://terranxt-backend.onrender.com/api/todos');
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
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  return (
    <div className="App d-flex justify-content-center p-5">
      <Container fluid="md"> {/* Use fluid="md" to make the container responsive */}
        <div className="w-100">
          {loading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
              <CircleLoader color="#007bff" loading={loading} size={100} />
            </div>
          ) : (
            <>
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
              <Table striped hover bordered responsive="md"> {/* Use responsive="md" to make the table responsive */}
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Action</th>
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
                      onClickRemove={handleShowDeleteModal}
                    />
                  ))}
                </tbody>
              </Table>
            </>
          )}
        </div>
      </Container>
    </div>
  );
};

export default App;
