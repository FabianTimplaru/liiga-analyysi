import express, { Express, Request, Response } from 'express';
import { SqliteMatchReader } from './readers/SqliteMatchReader';
import { describe } from 'node:test';

// Start the Express server
const PORT = 3000;
const app: Express = express();

const instance = new SqliteMatchReader();
console.log("Matches retrieved: " + instance.getAllMatches().length);
console.log(instance.getMatchById(1));
console.log(instance.getMatchById(9999));

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
// GET match by ID
app.get('/api/matches/:id', (req: Request, res: Response) => {
    const id: number = Number(req.params.id);

    // Validate the ID
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ description: "ID is invalid" });
    }

    // Find the match
    const match = instance.getMatchById(id);

    if (match === undefined) {
        return res.status(404).json({ description: "ID not found" });
    }

    // Return the match
    return res.status(200).json(match);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});