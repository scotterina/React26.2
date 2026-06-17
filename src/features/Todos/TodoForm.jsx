import { useState } from "react";
import TextInputWithLabel from "../../shared/TextInputWithLabel";
import { isValidTodoTitle } from "../../utils/todoValidation";
import DOMPurify from "dompurify";

function TodoForm({ onAddTodo }) {
  const [workingTodoTitle, setWorkingTodoTitle] = useState("");
  const [validationError, setValidationError] = useState("");

  function handleAddTodo(event) {
    event.preventDefault();

    const trimmedTitle = workingTodoTitle.trim();

    if (!isValidTodoTitle(workingTodoTitle)) {
      setValidationError("Todo title cannot be empty");
      return;
    }
    if (trimmedTitle.length > 100) {
      setValidationError("Todo title must be 100 characters or less.");
      return;
    }

    const sanitizedTitle = DOMPurify.sanitize(trimmedTitle, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
    });

    onAddTodo(sanitizedTitle);

    setWorkingTodoTitle("");
    setValidationError("");
  }

  return (
    <form onSubmit={handleAddTodo}>
      <TextInputWithLabel
        elementId="todoTitle"
        labelText="Todo: "
        value={workingTodoTitle}
        onChange={(event) => {
          setWorkingTodoTitle(event.target.value);
          setValidationError("");
        }}
        maxLength={100}
      />
      {validationError && <p className="error">{validationError}</p>}

      <button type="submit" disabled={!isValidTodoTitle(workingTodoTitle)}>
        Add Todo
      </button>
    </form>
  );
}

export default TodoForm;
