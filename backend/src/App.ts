import express, { Express, Request, Response } from 'express';
import { SqliteMatchReader } from './readers/SqliteMatchReader';

// Start the Express server
const PORT = 3000;
const app: Express = express();

// Create an instance of SqliteMatchReader
const instance = new SqliteMatchReader();

// Endpoints
// Root endpoint to check if the API is running
app.get('/', (req: Request, res: Response) => {
    res.send('Liiga API is running');
});

// GET all matches
app.get('/api/matches', (req: Request, res: Response) => {
    const allMatches = instance.getAllMatches();
    res.status(200).json(allMatches);
});

// GET match by ID
app.get('/api/matches/:id', (req: Request, res: Response) => {
    const id: number = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ description: "ID is invalid" });
    }
    const match = instance.getMatchById(id);
    if (match === undefined) {
        return res.status(404).json({ description: "ID not found" });
    }
    return res.status(200).json(match);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});