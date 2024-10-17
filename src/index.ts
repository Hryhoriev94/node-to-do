import express, {Application, Request, Response} from "express";
import { createConnection} from "./database";
import cors from 'cors';

const app: Application = express();
const port: number = 4000;

app.use(cors());
app.use(express.json());

let db: any;

createConnection().then((database) => {
    db = database as any;

    db.exec(`
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            completed BOOLEAN NOT NULL DEFAULT 0   
        )
    `)
})

let tasks: {id: number, title: string, completed: boolean}[] = [];

app.get('/tasks', async (req: Request, res: Response) => {
    const tasks = await db.all('SELECT * FROM tasks');
    res.json(tasks)
})

app.post('/tasks', async (req:Request, res:Response) => {
    const { title } = req.body;
    const result = await db.run('INSERT INTO tasks (title) VALUES (?)', [title]);
    const newTask = await db.get('SELECT * FROM tasks WHERE id = ?', [result.lastID])

    res.status(201).json(newTask);
})

app.put('/tasks/:id', async (req: Request, res: Response) => {
    const {id} = req.params;
    const { title, completed} = req.body;
    await db.run('UPDATE tasks SET title = ?, completed = ? WHERE id = ?', [title, id]);
    const updatedTask = await db.get('SELECT * FROM tasks WHERE id = ?', [id]);

    res.json(updatedTask);
})

app.delete('/tasks/:id', async (req: Request, res: Response) => {
    const {id} = req.params;
    await db.run('DELETE FROM tasks WHERE id = ?', [id]);
    res.status(204).send();
})


app.get('/', (req: Request, res: Response) => {
    res.send('Hello World');
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
})