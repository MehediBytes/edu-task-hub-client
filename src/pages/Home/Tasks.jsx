import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import useAxiosPublic from "../../hooks/UseAxiosPublic";
import Swal from "sweetalert2";
import { FaRegTrashCan } from "react-icons/fa6";
import { IoAddCircleOutline } from "react-icons/io5";
import useTasks from "../../hooks/useTasks";
import useLogs from "../../hooks/useLogs";

const Tasks = () => {
    const [tasks, tasksLoading, tasksRefetch] = useTasks();
    const [logs, logsLoading, logsRefetch] = useLogs();
    const [newTask, setNewTask] = useState({ title: "", description: "", category: "To-Do", dueDate: "" });
    const axiosPublic = useAxiosPublic();
    const [activityLog, setActivityLog] = useState([]);
    const [showAllLogs, setShowAllLogs] = useState(false);

    // Fetch tasks and logs initially
    useEffect(() => {
        tasksRefetch();
        logsRefetch();
    }, [tasksRefetch, logsRefetch]);

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

        // Get the maximum orderIndex from the tasks and add 1
        const maxOrderIndex = tasks.reduce((max, task) => Math.max(max, task.orderIndex), 0);
        const nextOrderIndex = maxOrderIndex + 1;

        const taskWithOrderIndex = { ...newTask, orderIndex: nextOrderIndex };
        const res = await axiosPublic.post("/tasks", taskWithOrderIndex);

        if (res.data) {
            Swal.fire("Success", "Task added!", "success");
            // After adding the task, fetch tasks again to get the updated list
            tasksRefetch();
            setActivityLog([...activityLog, { message: `Task "${newTask.title}" added` }]);
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
                await axiosPublic.post("/logs", { message: `Task "${title}" deleted` });
                tasksRefetch();
                logsRefetch();
                // Add log to activity log
                setActivityLog([...activityLog, { message: `Task "${title}" deleted` }]);
                Swal.fire("Deleted!", "The Task has been deleted.", "success");
            }
        });
    };


    // Handle Drag & Drop
    const handleDragEnd = async (result) => {
        if (!result.destination) return; // Do nothing if dropped outside

        const { source, destination } = result;
        const sourceCategory = source.droppableId;
        const destinationCategory = destination.droppableId;
        const sourceIndex = source.index;
        const destinationIndex = destination.index;

        let movedTask = tasks.find(task => task.orderIndex === sourceIndex);

        // Case 1: Task is reordered within the same category
        if (sourceCategory === destinationCategory) {
            const updatedTasks = [...tasks];
            const [task] = updatedTasks.splice(sourceIndex, 1);
            task.orderIndex = destinationIndex; // Update the order index within the same category
            updatedTasks.splice(destinationIndex, 0, task);

            // Refetch and update task order
            tasksRefetch(); // Refetch tasks after reordering
            await axiosPublic.put(`/tasks/${task._id}`, task);
            setActivityLog([...activityLog, { message: `Task "${task.title}" reordered in ${destinationCategory}` }]);
            await axiosPublic.post("/logs", { message: `Task "${task.title}" reordered in ${destinationCategory}` });
        }

        // Case 2: Task is moved between categories
        else {
            movedTask.category = destinationCategory; // Update the category of the task
            movedTask.orderIndex = destinationIndex; // Update the order index within the new category

            tasksRefetch(); // Refetch tasks after moving to another category

            await axiosPublic.put(`/tasks/${movedTask._id}`, movedTask);
            setActivityLog([...activityLog, { message: `Task "${movedTask.title}" moved to ${destinationCategory}` }]);
            await axiosPublic.post("/logs", { message: `Task "${movedTask.title}" moved to ${destinationCategory}` });
        }
    };


    const isOverdue = (dueDate) => {
        const currentDate = new Date();
        return new Date(dueDate) < currentDate;
    };

    const displayedLogs = showAllLogs ? activityLog : activityLog.slice(0, 10);

    if (tasksLoading || logsLoading) {
        return <div className="flex items-center justify-center min-h-screen">
            <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full border-purple-500 border-t-transparent"></div>
        </div>
    }

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
                <input
                    type="date"
                    name="dueDate"
                    className="input input-bordered w-full mb-3"
                    value={newTask.dueDate}
                    onChange={handleChange}
                />

                <label>Task Category</label>
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
                    {["To-Do", "In Progress", "Done"].map(category => (
                        <Droppable key={category} droppableId={category}>
                            {(provided) => (
                                <div {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className="bg-purple-200 p-4 rounded-lg min-h-screen">

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
                {logs.length === 0 ? (
                    <p>No logs available.</p>
                ) : (<ul>
                    {displayedLogs.map((log, index) => (
                        <li key={index} className="text-gray-700">
                            <span className="font-bold">{index + 1}.</span> {log.message}
                        </li>
                    ))}
                </ul>)}

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
