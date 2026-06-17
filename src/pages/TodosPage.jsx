import { useEffect, useReducer } from "react";

import TodoForm from "../features/Todos/TodoForm";
import TodoList from "../features/Todos/TodoList/TodoList";

import SortBy from "../shared/SortBy";
import FilterInput from "../shared/FilterInput";
import useDebounce from "../utils/useDebounce";

import { useAuth } from "../contexts/AuthContext";

import {
  todoReducer,
  initialTodoState,
  TODO_ACTIONS,
} from "../reducers/todoReducer";
import { useSearchParams } from "react-router";
import StatusFilter from "../shared/StatusFilter";
import styles from "./TodosPage.module.css";

function TodosPage() {
  const { token } = useAuth();
  const [state, dispatch] = useReducer(todoReducer, initialTodoState);
  const {
    todoList,
    error,
    filterError,
    isTodoListLoading,
    sortBy,
    sortDirection,
    filterTerm,
    dataVersion,
  } = state;

  const debouncedFilterTerm = useDebounce(filterTerm, 300);

  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get("status") || "all";

  function handleFilterTermChange(newFilterTerm) {
    dispatch({
      type: TODO_ACTIONS.SET_FILTER,
      payload: { filterTerm: newFilterTerm },
    });
  }

  useEffect(() => {
    async function fetchTodos() {
      try {
        dispatch({ type: TODO_ACTIONS.FETCH_START });

        const paramsObject = {
          sortBy,
          sortDirection,
        };

        if (debouncedFilterTerm) {
          paramsObject.find = debouncedFilterTerm;
        }

        if (statusFilter && statusFilter !== "all") {
          paramsObject.status = statusFilter;
        }

        const params = new URLSearchParams(paramsObject);

        const response = await fetch(`/api/tasks?${params}`, {
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

        dispatch({
          type: TODO_ACTIONS.FETCH_SUCCESS,
          payload: { todoList: data.tasks || data },
        });
      } catch (error) {
        const isFilterError =
          debouncedFilterTerm ||
          sortBy !== "creationDate" ||
          sortDirection !== "desc";

        dispatch({
          type: TODO_ACTIONS.FETCH_ERROR,
          payload: {
            message: isFilterError
              ? `error filtering/sorting todos: ${error.message}`
              : `error fetching todos: ${error.message}`,
            isFilterError,
          },
        });
      }
    }

    if (token) {
      fetchTodos();
    }
  }, [token, sortBy, sortDirection, debouncedFilterTerm, statusFilter]);

  async function addTodo(todoTitle) {
    const tempTodo = {
      id: Date.now(),
      title: todoTitle,
      isCompleted: false,
    };

    dispatch({
      type: TODO_ACTIONS.ADD_TODO_START,
      payload: { tempTodo },
    });

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": token,
        },
        credentials: "include",
        body: JSON.stringify({
          title: todoTitle,
          isCompleted: false,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add todo");
      }

      const data = await response.json();

      dispatch({
        type: TODO_ACTIONS.ADD_TODO_SUCCESS,
        payload: {
          tempId: tempTodo.id,
          savedTodo: data,
        },
      });
    } catch (error) {
      dispatch({
        type: TODO_ACTIONS.ADD_TODO_ERROR,
        payload: {
          tempId: tempTodo.id,
          message: error.message,
        },
      });
    }
  }

  async function completeTodo(id) {
    const originalTodo = todoList.find((todo) => todo.id === id);
    const updatedTodo = {
      ...originalTodo,
      isCompleted: !originalTodo.isCompleted,
    };

    dispatch({
      type: TODO_ACTIONS.COMPLETE_TODO_START,
      payload: { updatedTodo },
    });

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": token,
        },
        credentials: "include",
        body: JSON.stringify({
          isCompleted: updatedTodo.isCompleted,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update todo status");
      }

      dispatch({
        type: TODO_ACTIONS.COMPLETE_TODO_SUCCESS,
      });
    } catch (error) {
      dispatch({
        type: TODO_ACTIONS.COMPLETE_TODO_ERROR,
        payload: {
          originalTodo,
          message: error.message,
        },
      });
    }
  }

  async function updateTodo(editedTodo) {
    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);

    dispatch({
      type: TODO_ACTIONS.UPDATE_TODO_START,
      payload: { editedTodo },
    });

    try {
      const response = await fetch(`/api/tasks/${editedTodo.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": token,
        },
        credentials: "include",
        body: JSON.stringify({
          title: editedTodo.title,
          isCompleted: editedTodo.isCompleted,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update todo");
      }
      dispatch({
        type: TODO_ACTIONS.UPDATE_TODO_SUCCESS,
      });
    } catch (error) {
      dispatch({
        type: TODO_ACTIONS.UPDATE_TODO_ERROR,
        payload: {
          originalTodo,
          message: error.message,
        },
      });
    }
  }
  async function deleteTodo(id) {
    const originalTodo = todoList.find((todo) => todo.id === id);

    dispatch({
      type: TODO_ACTIONS.DELETE_TODO_START,
      payload: { id },
    });

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
        headers: {
          "X-CSRF-TOKEN": token,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete todo");
      }

      dispatch({
        type: TODO_ACTIONS.DELETE_TODO_SUCCESS,
      });
    } catch (error) {
      dispatch({
        type: TODO_ACTIONS.DELETE_TODO_ERROR,
        payload: {
          originalTodo,
          message: error.message,
        },
      });
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.pageHeader}>
        <h2 className={styles.heading}>Todos</h2>
        <p className={styles.description}>
          Add and manage your tasks to stay organized and track your progress
        </p>
      </div>
      {error && (
        <div className={styles.errorBox}>
          <p className={styles.error}>{error}</p>

          <button
            className={styles.button}
            onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_ERROR })}
          >
            Clear Error
          </button>
        </div>
      )}

      {filterError && (
        <div className={styles.errorBox}>
          <p className={styles.error}>{filterError}</p>

          <button
            className={styles.button}
            onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_FILTER_ERROR })}
          >
            Clear Filter Error
          </button>

          <button
            className={styles.secondaryButton}
            onClick={() => dispatch({ type: TODO_ACTIONS.RESET_FILTERS })}
          >
            Reset Filters
          </button>
        </div>
      )}

      {isTodoListLoading && <p className={styles.loading}>Loading todos...</p>}

      <section className={styles.controls}>
        <SortBy
          sortBy={sortBy}
          sortDirection={sortDirection}
          onSortByChange={(newSortBy) =>
            dispatch({
              type: TODO_ACTIONS.SET_SORT,
              payload: { sortBy: newSortBy, sortDirection },
            })
          }
          onSortDirectionChange={(newSortDirection) =>
            dispatch({
              type: TODO_ACTIONS.SET_SORT,
              payload: { sortBy, sortDirection: newSortDirection },
            })
          }
        />

        <StatusFilter />

        <FilterInput
          filterTerm={filterTerm}
          onFilterChange={handleFilterTermChange}
        />

        <TodoForm onAddTodo={addTodo} />

        <section className={styles.todoPanel}>
          <TodoList
            todoList={todoList}
            onCompleteTodo={completeTodo}
            onUpdateTodo={updateTodo}
            onDeleteTodo={deleteTodo}
            dataVersion={dataVersion}
            statusFilter={statusFilter}
          />
        </section>
      </section>
    </main>
  );
}

export default TodosPage;
