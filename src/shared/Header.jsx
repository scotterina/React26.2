import { useAuth } from "../contexts/AuthContext";

function Header() {
  const { isAuthenticated, email, logout } = useAuth();

  return (
    <header>
      <h1>Todo List</h1>

      {isAuthenticated && (
        <div>
          <p>Logged in as {email}</p>
          <button onClick={logout}>Log Out</button>
        </div>
      )}
    </header>
  );
}

export default Header;
