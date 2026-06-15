import "./App.css";
import { useState } from "react";

import Header from "./shared/Header";
import Logon from "./features/Logon";
import TodosPage from "./features/Todos/TodosPage";

import { useAuth } from "./contexts/AuthContext";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      <Header />
      {isAuthenticated ? <TodosPage /> : <Logon />}
    </div>
  );
}

export default App;
