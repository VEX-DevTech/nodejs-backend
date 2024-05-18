// Express para inicializar el servidor
import express from 'express';
// Morgan es un logger para ver las peticiones
import morgan from 'morgan';
// Cookie Parser en un modulo que nos permite leer las cookies
import cookieParser from 'cookie-parser';
// Cors
import cors from 'cors';

import authRoutes from './routes/auth.routes.js';
import payRoutes from './routes/pay.routes.js';


const app = express();


app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use('/api', authRoutes);
app.use('/api', payRoutes);

export default app;