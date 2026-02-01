import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors({
    origin: [
        process.env.PRODUCTION_URL,
        process.env.DEVELOPMENT_URL,
        'http://localhost:5173'
    ],
    methods: ['GET', 'POST',],
    credentials: true,
}));

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log('Server started');
})