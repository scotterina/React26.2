import { useState } from "react";
import TextInputWithLabel from "../../../shared/TextInputWithLabel";
import { isValidTodoTitle } from "../../../utils/todoValidation";
import styles from "./TodoListItem.module.css";
import DOMPurify from "dompurify";

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo, onDeleteTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [workingTitle, setWorkingTitle] = useState(todo.title);

  function handleEdit(event) {
    setWorkingTitle(event.target.value);
  }

  function handleCancel() {
    setWorkingTitle(todo.title);
    setIsEditing(false);
  }

  function handleUpdate(event) {
    event.preventDefault();

    if (!isEditing) {
      return;
    }

    const trimmedTitle = workingTitle.trim();

    if (!trimmedTitle || trimmedTitle.length > 100) {
      return;
    }

    const cleanTitle = DOMPurify.sanitize(trimmedTitle, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
    });

    onUpdateTodo({
      ...todo,
      title: cleanTitle,
    });

    setIsEditing(false);
  }

  return (
    <li>
      <form onSubmit={handleUpdate}>
        {isEditing ? (
          <>
            <TextInputWithLabel
              elementId={`todo-${todo.id}`}
              labelText="Edit Todo"
              value={workingTitle}
              onChange={handleEdit}
              maxLength={100}
            />

            <button type="button" onClick={handleCancel}>
              Cancel
            </button>

            <button type="submit" disabled={!isValidTodoTitle(workingTitle)}>
              Update
            </button>
          </>
        ) : (
          <>
            <label>
              <input
                className={styles.checkbox}
                type="checkbox"
                checked={todo.isCompleted}
                onChange={() => onCompleteTodo(todo.id)}
              />
            </label>

            <span onClick={() => setIsEditing(true)}>{todo.title}</span>
            <button onClick={() => onDeleteTodo(todo.id)}>Delete</button>
          </>
        )}
      </form>
    </li>
  );
}

export default TodoListItem;
