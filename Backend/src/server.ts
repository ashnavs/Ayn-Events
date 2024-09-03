import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import session from 'express-session';
import cors from 'cors';

import connectDB from './infrastructure/config/db';
import userRoutes from './interfaces/routes/userRoute';
import adminRoutes from './interfaces/routes/adminRoute';
import vendorRouter from './interfaces/routes/vendorRoute';
import favoriteRouter from './interfaces/routes/favoriteRoute';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';
import handleSocketEvents from './domain/helper/socketHandler';
import { createServer } from 'http';
import http from 'http'
import messageRouter from './interfaces/routes/messageRoute';
const app = express();
const server = http.createServer(app);



connectDB();


const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'], 
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
  secret: 'MY_SECRET',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));



const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

handleSocketEvents(io)

app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/vendor', vendorRouter);
app.use('/api/messages', messageRouter)
app.use('/api/favorites', favoriteRouter)



server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

