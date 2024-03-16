
import React from "react";
import { Badge } from "react-bootstrap";
import { FaCheck, FaTimes } from "react-icons/fa";
import { useDispatch } from "react-redux";

import { removeTodo, updateStatus } from "../redux/slice/todoSlice"; // Import removeTodo and updateStatus actions

interface TodoItemProps {
  id: number;
  name: string;
  isDone: boolean;
  createdAt: string;
  updatedAt?: string;
  onClickRemove: (id: number) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
  id,
  name,
  isDone,
  createdAt,
  updatedAt,
}) => {
  const dispatch = useDispatch();

  const handleStatusUpdate = () => {
    dispatch(updateStatus({ id }));
  };

  const handleDelete = async () => { // Define handleDelete as an async function
    try {
      const response = await fetch(`https://terranxt-backend.onrender.com/api/todos/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }
      dispatch(removeTodo({ id })); // Dispatch removeTodo action upon successful deletion
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error deleting todo:', error.message);
      } else {
        console.error('Unknown error:', error);
      }
    }
  };

  return (
    <tr>
      <td>
        <p className={`todo-item ${isDone && "done"}`}>{name}</p>
        <Badge bg="secondary">{createdAt}</Badge>
      </td>
      <td>
        <Badge bg={isDone ? "success" : "danger"}>
          {isDone ? "Done" : "Pending"}
        </Badge>
        {isDone && <p>{updatedAt}</p>}
      </td>
      {!isDone && (
        <td>
          <div style={{ color: "green" }} onClick={handleStatusUpdate}>
            <FaCheck />
          </div>
        </td>
      )}
      <td colSpan={isDone ? 2 : 1}>
        <div style={{ color: "red" }} onClick={handleDelete}>
          <FaTimes />
        </div>
      </td>
    </tr>
  );
};

export default TodoItem;
