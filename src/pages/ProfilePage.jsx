import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

function ProfilePage() {
  const { email, token } = useAuth();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTodos() {
      if (!token) {
        return;
      }
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/tasks", {
          headers: {
            "X-CSRF-Token": token,
          },
          credentials: "include",
        });

        if (response.status === 401) {
          throw new Error("Unauthorized");
        }

        if (!response.ok) {
          throw new Error("Failed to fetch todos");
        }

        const data = await response.json();
        setTodos(data.tasks);
      } catch (error) {
        setError(`Error loading statistics: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }

    fetchTodos();
  }, [token]);

  const total = todos.length;
  const completed = todos.filter((todo) => todo.isCompleted).length;
  const active = total - completed;

  const completionPercentage =
    total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div>
      <h2>Profile</h2>

      <section>
        <h3>Account Information</h3>
        <p>Email: {email}</p>
      </section>

      <section>
        <h3>Todo Statistics</h3>

        {loading && <p>Loading statistics...</p>}

        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && !error && (
          <>
            <p>Total Tasks: {total}</p>
            <p>Completed Tasks: {completed}</p>
            <p>Active Tasks: {active}</p>
            <p>Completion Percentage: {completionPercentage}%</p>
          </>
        )}
      </section>
    </div>
  );
}

export default ProfilePage;
