import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import styles from "./ProfilePage.module.css";

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
            "X-CSRF-TOKEN": token,
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
        setTodos(data.tasks || data);
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
    <main className={styles.page}>
      <h2 className={styles.heading}>Profile</h2>

      <section className={styles.card}>
        <h3>Account Information</h3>
        <p>Email: {email}</p>
      </section>

      <section className={styles.card}>
        <h3>Todo Statistics</h3>

        {loading && <p className={styles.loading}>Loading statistics...</p>}

        {error && <p className={styles.error}>{error}</p>}

        {!loading && !error && (
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{total}</span>
              <span>Total Tasks</span>
            </div>

            <div className={styles.statItem}>
              <span className={styles.statNumber}>{completed}</span>
              <span>Completed</span>
            </div>

            <div className={styles.statItem}>
              <span className={styles.statNumber}>{active}</span>
              <span>Active</span>
            </div>

            <div className={styles.statItem}>
              <span className={styles.statNumber}>{completionPercentage}%</span>
              <span>Completion</span>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default ProfilePage;
