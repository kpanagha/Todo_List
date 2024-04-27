import React, { useState } from "react";
import { Todo } from "./Todo";
import { TodoForm } from "./TodoForm";
import { v4 as uuidv4 } from "uuid";
import { EditTodoForm } from "./EditTodoForm";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";  
import mixpanel from "mixpanel-browser";

export const TodoWrapper = () => {
  const navigate = useNavigate();

  const [todos, setTodos] = useState([]);
  const userId = sessionStorage.getItem("id");

  // const addTodo = (todo) => {
  //   setTodos([
  //     ...todos,
  //     { id: uuidv4(), task: todo, completed: false, isEditing: false },
  //   ]);
  // }
  useEffect(() => {
    if (!userId) {
      navigate("/login");
    }
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`http://localhost:1000/api/v2/getTasks/${userId}`);
        setTodos(response.data.list || []);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    };
    fetchTasks();
  }, [userId, navigate]);

  const addTodo = async (todo) => {
    try {
      const response = await axios.post('http://localhost:1000/api/v2/addTask', { title: todo, id: userId });
      
  
      if (response.status === 200 && response.data && response.data.list) {
        const newTodo = response.data.list; // Extract the new todo item from the response
        setTodos([...todos, newTodo]); // Update the state with the new todo item
        mixpanel.track('Task Added', { userId: userId, taskId: newTodo._id, taskTitle: newTodo.title });
      } else {
        throw new Error('Failed to add todo');
      }
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };
  

  // const deleteTodo = (id) => setTodos(todos.filter((todo) => todo.id !== id));

  

  const toggleEdit = (id) => {
    console.log(todos);
    setTodos(
      todos.map((todo) =>
        todo._id === id ? { ...todo, isEditing: true } : todo
      )
    );
  }
  const editTask = async (task, id) => {
    try {
      // Send edit request to backend
      console.log(task,"update task");
      const response = await axios.put(`http://localhost:1000/api/v2/updateTask/${id}`, { task });
      // Check if edit was successful
      if (response.status === 200) {
        // Update frontend state with the edited task
        setTodos(
          todos.map((todo) =>
            todo._id === id ? { ...todo, title:task,isEditing:false,completed:true } : todo
          )
        );
        mixpanel.track('Task Edited', { userId: userId, taskId: id, newTaskTitle: task });
      } else {
        console.error('Failed to edit task');
      }
    } catch (error) {
      console.error('Error editing task:', error);
    }
  };
  const deleteTask = async (id, userId) => {
    try {
      // console.log(id, userId, "uuu");
      // Send delete request to backend
      const response = await axios.delete(`http://localhost:1000/api/v2/deleteTask/${id}`, { data: { id: userId }, });
      console.log(response);
      if (response.status === 200) {
        // Update frontend state by filtering out the deleted task
        setTodos(todos.filter((todo) => todo._id !== id));
        mixpanel.track('Task Deleted', { userId: userId, taskId: id });
      } else {
        console.error('Failed to delete task. Server returned status:', response.status);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      }
    }
  };  
  console.log(todos,"todosssssss");
  return (
    
    
    <div className="TodoWrapper">
  <h1>Get Things Done!</h1>
  <TodoForm addTodo={addTodo} />
  {/* display todos */}
  {todos.map((item, index) =>
    item.isEditing ? (
      <EditTodoForm key={index} editTodo={editTask} task={item} />
    ) : (
      <Todo
        key={index}
        task={item.title}
        id={item._id}
        editTodo={() => toggleEdit(item._id)}
        // toggleComplete = {()=>toggleComplete(item._id)}
        deleteTodo={() => deleteTask(item._id)}
      />
    )
  )}
</div>

  );
};