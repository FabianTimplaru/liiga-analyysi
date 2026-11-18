import express, { Express, Request, Response } from 'express';
import { db } from './db/database';
import { initDb } from './db/initDb';
import { DataHandler } from './services/DataHandler';
import type { CsvMatch } from './models/CsvMatch';

// Initialize the database and import CSV data
const result = db.prepare('SELECT sqlite_version() AS version').get() as { version: string; };
console.log(`Sqlite version: ${result.version}`);
initDb();
const records = DataHandler.parseCsv<CsvMatch>('../data/liiga25-26.csv');
console.log(`CSV data: ${records.length} records`);
const firstRecord = records[0];

if (firstRecord) {
    const match = DataHandler.toMatch(firstRecord);
    console.log(match);
}

// Start the Express server
const PORT = 3000;
const app: Express = express();

// Endpoints
app.get('/', (req: Request, res: Response) => {
    res.send('Liiga API is running');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});