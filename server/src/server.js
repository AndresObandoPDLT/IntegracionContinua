import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3005;

app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://frontend:3000',
        process.env.FRONTEND_URL
    ],
    credentials: true
}))

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).send({
        message: "Server is running"
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})