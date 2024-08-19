// import express from 'express';
// import session from 'express-session';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import connectDB from './infrastructure/config/db';
// import userRoutes from './interfaces/routes/userRoute';
// import adminRoutes from './interfaces/routes/adminRoute';
// import vendorRouter from './interfaces/routes/vendorRoute';
// import cookieParser from 'cookie-parser'
// import { Server } from 'socket.io';
// import { handleSocketEvents } from './domain/helper/socketHandler'; 
// import { createServer } from 'http';
// import chatRouter from './interfaces/routes/chatRoutes';

// dotenv.config();
// connectDB();

// const app = express();
// const PORT = process.env.PORT || 5000;




// const corsOptions = {
//   origin: 'http://localhost:5173',
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
//   allowedHeaders: ['Content-Type', 'Authorization'], 
//   credentials: true,

// };


// app.use(cors(corsOptions));


// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser())


// app.use(session({
//   secret:'MY_SECRET',
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: false }
// }));

// const server = createServer(app)
// const io = new Server(server, {
//   cors: {
//     origin: 'http://localhost:5173',
//     methods: ['GET', 'POST'],
//     credentials: true,
//   },
// });

// // Handle Socket.io events
// io.on('connection', (socket) => {
//   console.log('a user connected');
//   handleSocketEvents(io, socket);
// });



// app.use( '/api/users',userRoutes);
// app.use('/api/admin' , adminRoutes)
// app.use('/api/vendor', vendorRouter)
// app.use('/api/chat',chatRouter)

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
















import express from 'express';
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './infrastructure/config/db';
import userRoutes from './interfaces/routes/userRoute';
import adminRoutes from './interfaces/routes/adminRoute';
import vendorRouter from './interfaces/routes/vendorRoute';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';
import handleSocketEvents from './domain/helper/socketHandler';
import { createServer } from 'http';
import http from 'http'
import messageRouter from './interfaces/routes/messageRoute';
const app = express();
const server = http.createServer(app);


dotenv.config();
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

// Create HTTP server and attach Socket.IO

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

handleSocketEvents(io)

// Define routes
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/vendor', vendorRouter);
app.use('/api/messages', messageRouter)


// Start the server using the HTTP server instance
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

