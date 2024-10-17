import React, { useState, useEffect } from 'react';
import TaskList from "./components/TaskList.tsx";

interface Task {
    id: number;
    title: string;
    completed: boolean;
}

function App() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [title, setTitle] = useState<string>('');

    const apiUrl = 'http://localhost:4000/tasks';

    useEffect(() => {
        fetchTasks()
    }, []);


    const fetchTasks = async () => {
        try {
            const response = await fetch(apiUrl)
            if(!response.ok) {
                throw new Error('Error receiving tasks');
            }
            const data = await response.json();
            setTasks(data)
        }
        catch(error) {
            console.error('Error receiving tasks', error)
        }
    }

    const addTask = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({title})
            });
            if(!response.ok) {
                throw new Error('Error adding task');
            }
            setTitle('');
            fetchTasks();
        } catch (error) {
            console.error('Error adding task', error);
        }
    }

    return (
        <div className="App">
            <h1 className={'AppTitle'}>TO-DO LIST</h1>
            <form onSubmit={addTask}>
                <input type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
                required
                />
                <button type="submit">Add task</button>
            </form>
            <TaskList tasks={tasks} />
        </div>
    )
}

export default App