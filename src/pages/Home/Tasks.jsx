import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import useAxiosPublic from "../../hooks/UseAxiosPublic";
import Swal from "sweetalert2";
import { io } from "socket.io-client";
import { FaTrash } from "react-icons/fa";

const socket = io(import.meta.env.VITE_API_URL);

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({ title: "", description: "", category: "To-Do" });
    const axiosPublic = useAxiosPublic();

    // Fetch tasks from the backend
    const fetchTasks = async () => {
        const res = await axiosPublic.get("/tasks");
        setTasks(res.data);
    };

    useEffect(() => {
        fetchTasks();
        socket.on("taskUpdated", fetchTasks);
        return () => socket.off("taskUpdated");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        setNewTask({ ...newTask, [e.target.name]: e.target.value });
    };

    // Add task
    const addTask = async () => {
        if (!newTask.title) return Swal.fire("Please Put Title. Title is required!");
        if (newTask.title.length > 50) {
            return Swal.fire("Error", "Title must be 50 characters or less!", "error");
        }
        if (newTask.description.length > 200) {
            return Swal.fire("Error", "Description must be 200 characters or less!", "error");
        }
        await axiosPublic.post("/tasks", newTask);
        Swal.fire("Task Successfully Posted!")
        setNewTask({ title: "", description: "", category: "To-Do" });
    };

    // Delete task
    const deleteTask = async (id) => {
        await axiosPublic.delete(`/tasks/${id}`);
    };

    // Handle Drag & Drop
    const handleDragEnd = async (result) => {
        if (!result.destination) return;
        const updatedTasks = [...tasks];
        const [movedTask] = updatedTasks.splice(result.source.index, 1);
        movedTask.category = result.destination.droppableId;
        updatedTasks.splice(result.destination.index, 0, movedTask);
        setTasks(updatedTasks);
        await axiosPublic.put(`/tasks/${movedTask._id}`, movedTask);
    };

    return (
        <div className="container mx-auto px-3">
            <h1 className="text-3xl font-bold text-center mb-5 text-purple-500">Task Management System</h1>
            <div className="bg-base-100 p-5 rounded-lg">
                <input
                    type="text"
                    name="title"
                    placeholder="Task Title *"
                    className="input input-bordered w-full mb-3"
                    value={newTask.title}
                    onChange={handleChange}
                />
                <textarea
                    name="description"
                    placeholder="Task Description"
                    className="textarea textarea-bordered w-full mb-3"
                    value={newTask.description}
                    onChange={handleChange}
                />

                {/* Category Dropdown */}
                <select
                    name="category"
                    className="select select-bordered text-gray-400 w-full mb-3"
                    value={newTask.category}
                    onChange={handleChange}
                >
                    <option value="To-Do">To-Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                </select>

                <button className="btn bg-purple-500 text-base-100 hover:bg-purple-700 w-full" onClick={addTask}>
                    Add Task
                </button>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="grid grid-cols-3 gap-4 mt-5">
                    {["To-Do", "In Progress", "Done"].map(category => (
                        <Droppable key={category} droppableId={category}>
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef}
                                    className="bg-purple-200 p-4 rounded-lg min-h-screen">
                                    <h2 className="text-xl font-semibold mb-3 text-center text-purple-500">{category}</h2>
                                    {tasks.filter(task => task.category === category)
                                        .map((task, index) => (
                                            <Draggable key={task._id} draggableId={task._id} index={index}>
                                                {(provided) => (
                                                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                                                        className="bg-base-100 p-3 rounded-lg mb-2 shadow-md flex flex-col justify-center items-center">
                                                        <h3 className="font-bold">{task.title}</h3>
                                                        <p>{task.description}</p>
                                                        <button className="btn btn-sm btn-error mt-2"
                                                            onClick={() => deleteTask(task._id)}><FaTrash></FaTrash></button>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
};

export default Tasks;
