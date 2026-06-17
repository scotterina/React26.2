import { NavLink } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import styles from "./navigation.module.css";

function Navigation() {
  const { isAuthenticated } = useAuth();

  const navLinkStyle = ({ isActive }) =>
    isActive ? `${styles.navLink} ${styles.active}` : styles.navLink;

  return (
    <nav className={styles.nav}>
      <ul className={styles.navList}>
        <li>
          <NavLink to="/about" className={navLinkStyle}>
            About
          </NavLink>
        </li>
        {isAuthenticated ? (
          <>
            <li>
              <NavLink to="/todos" className={navLinkStyle}>
                Todos
              </NavLink>
            </li>
            <li>
              <NavLink to="/profile" className={navLinkStyle}>
                Profile
              </NavLink>
            </li>
          </>
        ) : (
          <li>
            <NavLink to="/login" className={navLinkStyle}>
              Login
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navigation;
