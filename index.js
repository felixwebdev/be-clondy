import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import http from 'http';
import router from './src/routes/index.js';
import {connectDB} from './src/config/db.js';
import { initSocket } from "./src/socket/socket.js"; 

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

app.use(morgan('combined'));
app.use(express.json());
app.use(cors());
connectDB();

router(app);
initSocket(server);

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
