import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import router from './src/routes/index.js';
import {connectDB} from './src/config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan('combined'));
app.use(express.json());
connectDB();

router(app);

app.listen(PORT, ()=> {
     console.log(`Server listen from port http://localhost:${PORT}`);
});