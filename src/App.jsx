import "./App.css";
import TodoList from "./TodoList.jsx";
import TodoForm from "./TodoForm.jsx";

function App() {
  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm />
      <TodoList />
    </div>
  );
}

export default App;
