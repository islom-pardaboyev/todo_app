import {
    CheckCircle2,
    Circle,
    PlusCircle,
    SunMedium,
    Trash2,
  } from "lucide-react";
  import { useState } from "react";
  import { useForm } from "react-hook-form";
  import { TodoType } from "../utils";
  import { toast } from "sonner";
  
  type FormValue = {
    todo: string;
  };
  
  function TaskArea() {
    const { register, handleSubmit, reset } = useForm<FormValue>();
    const [todos, setTodos] = useState<TodoType[]>(() => {
      const savedTodos = window.localStorage.getItem('todos');
      return savedTodos ? JSON.parse(savedTodos) : [];
    });
    const formSubmit = (data: FormValue) => {
      if (todos.some((t) => t.title === data.todo)) {
        toast.error("Tast already exist");
        return;
      } else {
        const todoContext = {
          id: todos.length ? Math.max(...todos.map((t) => t.id)) + 1 : 1,
          title: data.todo,
          completed: false,
          date: Date.now(),
        };
        setTodos((p) => [todoContext, ...p]);
        reset();
      }
      toast.success("Task added successfully");
    };
  
    const deleteTodo = (id: number) => {
      setTodos((p) => p.filter((t) => t.id !== id));
      toast.success("Task deleted successfully");
    };
  
    const toggleTodo = (id: number) => {
      setTodos((p) =>
        p.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
      );
      toast.success("Task changed");
    };
    window.localStorage.setItem('todos', JSON.stringify(todos))
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
        <div className="max-w-2xl mx-auto pt-16 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                <SunMedium className="text-yellow-500" />
                Today's Tasks
              </h1>
  
              <span className="text-sm text-gray-500">
                {todos.filter((t) => t.completed).length}/{todos.length} completed
              </span>
            </div>
            <form action="" onSubmit={handleSubmit(formSubmit)} className="mb-6">
              <div className="flex gap-2">
                <input
                  {...register("todo", { required: true })}
                  type="text"
                  placeholder="Add a new task..."
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                />
                <button
                  type="submit"
                  className="px-4 py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 transition-all flex items-center gap-2"
                >
                  <PlusCircle size={20} />
                  Add
                </button>
              </div>
            </form>
            <div className="space-y-3">
              {todos.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center gap-3 p-4 rounded-xl transition-all ${
                    task.completed ? "bg-gray-50" : "bg-white"
                  } border border-gray-100 hover:border-gray-200 group`}
                >
                  <button onClick={() => toggleTodo(task.id)}>
                    {task.completed ? (
                      <CheckCircle2
                        className="text-green-500 hover:text-green-600"
                        size={24}
                      />
                    ) : (
                      <Circle
                        className="text-gray-400 hover:text-gray-600"
                        size={24}
                      />
                    )}
                  </button>
                  <span
                    className={`flex-1 text-lg ${
                      task.completed
                        ? "text-gray-400 line-through"
                        : "text-gray-700"
                    }`}
                  >
                    {task.title}
                  </span>
                  <button
                    onClick={() => deleteTodo(task.id)}
                    className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity focus:outline-none"
                  >
                    <Trash2
                      className="text-red-400 hover:text-red-500"
                      size={20}
                    />
                  </button>
                </div>
              ))}
            </div>
            {todos.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  No tasks yet. Add one to get started!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  export default TaskArea;
  