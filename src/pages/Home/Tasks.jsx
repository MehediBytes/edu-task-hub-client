import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import useAxiosPublic from "../../hooks/UseAxiosPublic";
import Swal from "sweetalert2";
import { io } from "socket.io-client";
import { FaRegTrashCan } from "react-icons/fa6";
import { IoAddCircleOutline } from "react-icons/io5";

const socket = io(import.meta.env.VITE_API_URL);

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({ title: "", description: "", category: "To-Do", dueDate: "" });
    const axiosPublic = useAxiosPublic();
    const [activityLog, setActivityLog] = useState([]);
    const [showAllLogs, setShowAllLogs] = useState(false);

    // Fetch tasks from the backend
    const fetchTasks = async () => {
        const res = await axiosPublic.get("/tasks");
        setTasks(res.data);
    };
    // Fetch logs from the backend
    const fetchLogs = async () => {
        const res = await axiosPublic.get("/logs");
        setActivityLog(res.data);
    };

    useEffect(() => {
        fetchTasks();
        fetchLogs();
        socket.on("taskUpdated", () => {
            fetchTasks();
            fetchLogs();
        });
        return () => socket.off("taskUpdated");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        setNewTask({ ...newTask, [e.target.name]: e.target.value });
    };

    // Add task
    const addTask = async () => {
        if (!newTask.title) return Swal.fire("Error", "Please Put A Title. Title is required.", "error");
        if (newTask.title.length > 50) {
            return Swal.fire("Error", "Title must be 50 characters or less!", "error");
        }
        if (newTask.description.length > 200) {
            return Swal.fire("Error", "Description must be 200 characters or less!", "error");
        }
        if (!newTask.dueDate) {
            return Swal.fire("Error", "Please select a due date!", "error");
        }
        const res = await axiosPublic.post("/tasks", newTask);
        if (res.data) {
            Swal.fire("Success", "Task added!", "success");
            await axiosPublic.post("/logs", { message: `Task "${newTask.title}" added` });
        }
        setNewTask({ title: "", description: "", category: "To-Do", dueDate: "" });
    };

    // Delete task
    const deleteTask = async (id, title) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to delete the Task?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axiosPublic.delete(`/tasks/${id}`);
                await axiosPublic.post("/logs", { message: `Task "${title}" deleted` }); // Log Activity
                fetchTasks();
                fetchLogs();
                Swal.fire("Deleted!", "The Task has been deleted.", "success");
            }
        });
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
        await axiosPublic.post("/logs", { message: `Task "${movedTask.title}" moved to ${movedTask.category}` });
    };

    const isOverdue = (dueDate) => {
        const currentDate = new Date();
        return new Date(dueDate) < currentDate;
    };

    const displayedLogs = showAllLogs ? activityLog : activityLog.slice(0, 10);

    return (
        <div className="container mx-auto px-3">
            <h1 className="text-3xl font-bold text-center mb-5 text-purple-500">Task Management System</h1>
            <div>
                <label>Task Title</label>
                <input
                    type="text"
                    name="title"
                    placeholder="Task Title *"
                    className="input input-bordered w-full mb-3"
                    value={newTask.title}
                    onChange={handleChange}
                />

                <label>Task Description</label>
                <textarea
                    name="description"
                    placeholder="Task Description"
                    className="textarea textarea-bordered w-full mb-3"
                    value={newTask.description}
                    onChange={handleChange}
                />

                <label>Task Due Date</label>
                {/* Task Due date */}
                <input
                    type="date"
                    name="dueDate"
                    className="input input-bordered w-full mb-3"
                    value={newTask.dueDate}
                    onChange={handleChange}
                />

                <label>Task Category</label>
                {/* Category Dropdown */}
                <select
                    name="category"
                    className="select select-bordered w-full mb-3"
                    value={newTask.category}
                    onChange={handleChange}
                >
                    <option value="To-Do">To-Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                </select>

                <div className="flex justify-center items-center">
                    <button
                        className="btn bg-purple-500 text-base-100 hover:bg-purple-700 text-lg flex justify-center items-center"
                        onClick={addTask}>
                        <span>Add Task</span> <IoAddCircleOutline />
                    </button>
                </div>
            </div>

            <div className="mt-5">
                <h3 className="text-xl font-bold">All Tasks On The Basis Of Categories:</h3>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="grid grid-cols-3 gap-4 mt-5">

                    {["To-Do", "In Progress", "Done"].map(category => (
                        <Droppable key={category} droppableId={category}>
                            {(provided) => (
                                <div {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className="bg-purple-200 p-4 rounded-lg min-h-[250px]">

                                    <h2 className="text-xl font-bold mb-3 text-center text-purple-500">{category}</h2>

                                    {tasks.filter(task => task.category === category)
                                        .map((task, index) => (
                                            <Draggable key={task._id} draggableId={task._id} index={index}>
                                                {(provided) => (
                                                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                                                        className="bg-base-100 p-3 rounded-lg mb-2 shadow-md flex flex-col justify-center items-center">
                                                        <h3 className="font-bold">{task.title}</h3>
                                                        <p>{task.description}</p>
                                                        <p className={`text-sm ${isOverdue(task.dueDate) ? "text-red-600" : "text-green-600"}`}>
                                                            Due Date: {new Date(task.dueDate).toLocaleDateString()}
                                                        </p>
                                                        <button className="btn btn-sm btn-error mt-2 rounded-full"
                                                            onClick={() => deleteTask(task._id, task.title)}><FaRegTrashCan /></button>
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
            {/* Activity Log Section */}
            <div className="mt-5 bg-purple-100 px-3 rounded-lg">
                <h3 className="text-xl font-bold mb-3">Activity Log:</h3>
                <ul>
                    {displayedLogs.map((log, index) => (
                        <li key={index} className="text-gray-700">
                            <span className="font-bold">{index + 1}.</span> {log.message}
                        </li>
                    ))}
                </ul>
                {activityLog.length > 10 && (
                    <button
                        className="btn btn-sm bg-purple-500 text-base-100 hover:bg-purple-700 mt-3"
                        onClick={() => setShowAllLogs(!showAllLogs)}
                    >
                        {showAllLogs ? "Show Less Logs" : "See More Logs"}
                    </button>
                )}
            </div>
        </div>
    );
};

export default Tasks;