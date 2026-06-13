import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

function ProfilePage() {
  const { email, token } = useAuth();
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTodos() {
      try {
        const response = await fetch("/api/tasks", {
          headers: {
            "X-CSRF-Token": token,
          },
          credentials: "include",
        });

        const data = await response.json();
        setTodos(data.tasks);
      } catch (error) {
        setError(error.message);
      }
    }

    fetchTodos();
  }, [token]);

  const total = todos.length;
  const completed = todos.filter((todo) => todo.isCompleted).length;
  const active = total - completed;

  return (
    <div>
      <h2>Profile</h2>
      <p>Email: {email}</p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <p>Total Tasks: {total}</p>
      <p>Completed Tasks: {completed}</p>
      <p>Active Tasks: {active}</p>
    </div>
  );
}

export default ProfilePage;
