import { useAuth } from "../contexts/AuthContext";
import Navigation from "./Navigation";
import Logoff from "../features/Logoff";

function Header() {
  const { isAuthenticated } = useAuth();

  return (
    <header>
      <h1>Todo List</h1>

      <Navigation />

      {isAuthenticated && <Logoff />}
    </header>
  );
}

export default Header;
