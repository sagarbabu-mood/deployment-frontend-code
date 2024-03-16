import React, { useState } from "react";
import { Badge } from "react-bootstrap";
import { FaCheck, FaTimes } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { removeTodo, updateStatus } from "../redux/slice/todoSlice";
import { ClipLoader } from "react-spinners"; // Import ClipLoader from React Spinners

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
  const [loading, setLoading] = useState(false); // State to manage loading state

  const handleStatusUpdate = () => {
    dispatch(updateStatus({ id }));
  };

  const handleDelete = async () => {
    try {
      setLoading(true); // Set loading state to true
      const response = await fetch(`https://terranxt-backend.onrender.com/api/todos/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }
      dispatch(removeTodo({ id }));
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error deleting todo:', error.message);
      } else {
        console.error('Unknown error:', error);
      }
    } finally {
      setLoading(false); // Set loading state back to false after operation completes
    }
  };

  const formattedCreatedAt = new Date(createdAt).toLocaleString();

  return (
    <tr>
      <td>
        <p className={`todo-item ${isDone && "done"}`}>{name}</p>
        <Badge bg="secondary">{formattedCreatedAt}</Badge>
      </td>
      <td>
        <Badge bg={isDone ? "success" : "danger"}>
          {isDone ? "Done" : "Pending"}
        </Badge><br/>
        {isDone && <Badge>{updatedAt}</Badge>}
      </td>
      {!isDone && (
        <td>
          <div style={{ color: "green" }} onClick={handleStatusUpdate}>
            <FaCheck />
          </div>
        </td>
      )}
      <td colSpan={isDone ? 2 : 1}>
        {loading ? ( // Render loader if loading state is true
          <ClipLoader color={"#000"} loading={loading} size={30} />
        ) : (
          <div style={{ color: "red" }} onClick={handleDelete}>
            <FaTimes />
          </div>
        )}
      </td>
    </tr>
  );
};

export default TodoItem;
