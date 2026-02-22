import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userAuth from './routes/auth.js';
import voting from './routes/voting.js';
import { redisConnect } from './config/redisConnect.js';
import { connectDB } from './config/connectDB.js';

const app = express();  

async function initConnection() {
    if (!redisConnect.isOpen) {
        await redisConnect.connect();
        console.log(`Redis connected`);
    }

    await connectDB(process.env.NODE_ENV);
}

initConnection();

app.use(express.json());
app.use(cookieParser());
// app.use(cors({
//     origin: [
//         process.env.FRONTEND_PRODUCTION_URL,
//         process.env.FRONTEND_DEVELOPMENT_URL,
//         'http://localhost:5173'
//     ],
//     methods: ['GET', 'POST', 'PUT'],
//     credentials: true,
// }));

app.use(cors());

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: "Backend running... heheheheeee"
    })
});

app.use(voting);
app.use(userAuth);

const port = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "test") {
    app.listen(port, () => {
        console.log('Server started');
    })
}


export default app;


