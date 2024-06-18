import express from 'express';
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './infrastructure/config/db';
import userRoutes from './interfaces/routes/userRoute';
import adminRoutes from './interfaces/routes/adminRoute';

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;



// CORS options
const corsOptions = {
  origin: 'http://localhost:5173', // Allow only this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow only these methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow only these headers
};

// Use CORS middleware with options
app.use(cors(corsOptions));

// Use JSON middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use session middleware
app.use(session({
  secret:'MY_SECRET',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// app.use(session({
//   secret: 'sessionSecret',
//   resave: false,
//   saveUninitialized: true,
//   cookie: {
//       maxAge: 24 * 60 * 60 * 1000,
//   }
// }))

// Use user routes
app.use( '/api/users',userRoutes);
app.use('/api/admin' , adminRoutes)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
