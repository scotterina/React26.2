import { useAuth } from "../contexts/AuthContext";
import Navigation from "./Navigation";
import Logoff from "../features/Logoff";
import styles from "./Header.module.css";

function Header() {
  const { isAuthenticated, email } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.topRow}>
        <div>
          <h1 className={styles.title}>Todo List Manager</h1>

          {isAuthenticated && (
            <p className={styles.userInfo}>Logged in as {email}</p>
          )}
        </div>
        {isAuthenticated && (
          <div className={styles.rightSide}>
            <Navigation />
            <Logoff />
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
