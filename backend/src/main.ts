import express, { Express, Request, Response } from 'express';
import { db } from './db/database';
import { initDb } from './db/initDb';

const result = db.prepare('SELECT sqlite_version() AS version').get() as { version: string; };
console.log(`Sqlite version: ${result.version}`);
initDb();
const test = db.prepare(
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'matches';"
).get() as { name: string; };

console.log(`Test result: ${test.name}`);

const PORT = 3000;
const app: Express = express();

app.get('/', (req: Request, res: Response) => {
    res.send('Liiga API is running');
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});