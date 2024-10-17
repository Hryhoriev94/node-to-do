import React from "react";

interface Task {
    id: number;
    title: string;
    completed: boolean;
}

interface TaskListProps {
    tasks: Task[]
}

const TaskList: React.FC<TaskListProps> = ({tasks}) => {
    return (
        <ul className="taskList">
            {tasks.map((task) => (
                <li key={task.id}>
                    {task.title} - {task.completed ? 'Completed' : 'Not completed'}
                </li>
            ))}
        </ul>
    )
}

export default TaskList