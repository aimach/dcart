import express, { Application, Request, Response } from 'express';
import { AppDataSource } from './data-source';

const app: Application = express();
const PORT = 5000;

// Middleware
app.use(express.json());

// Connect to the database
AppDataSource.initialize()
  .then(() => console.log('Database connected'))
  .catch((err) => console.error('Database connection error:', err));

// Routes
app.get('/', (req: Request, res: Response) => {res.status(200).send('Backend in development!')});

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
