import express, { Express, Request, Response } from 'express';
import { SqliteMatchReader } from './readers/SqliteMatchReader';
import cors from 'cors';

// Start the Express server
const PORT = 3000;
const app: Express = express();

// Enable CORS for requests from the wanted origin
app.use(cors({ origin: 'http://localhost:5173' }));

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

// GET all teams
app.get('/api/teams', (req: Request, res: Response) => {
    const teams = instance.getTeams();
    res.status(200).json(teams);
});

// GET wins by team in descending order
app.get('/api/stats/wins', (req: Request, res: Response) => {
    const teamWins = instance.getTeamWins();
    res.status(200).json(teamWins);
});

// GET attendance stats: min, max, avg
app.get('/api/stats/attendance', (req: Request, res: Response) => {
    const attendanceStats = instance.getAttendanceStats();
    attendanceStats ? res.status(200).json(attendanceStats)
        : res.status(404).json({ description: "Attendance stats are missing" });
});

// GET referee stats
app.get('/api/stats/referees', (req: Request, res: Response) => {
    const refereeStats = instance.getRefereeStats();
    res.status(200).json(refereeStats);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});