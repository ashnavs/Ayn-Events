import express from 'express';
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './infrastructure/config/db';
import userRoutes from './interfaces/routes/userRoute';
import adminRoutes from './interfaces/routes/adminRoute';
import vendorRouter from './interfaces/routes/vendorRoute';
import cookieParser from 'cookie-parser'

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;




const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'], 
  credentials: true, // This line is important for allowing cookies

};


app.use(cors(corsOptions));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())


app.use(session({
  secret:'MY_SECRET',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));


app.use( '/api/users',userRoutes);
app.use('/api/admin' , adminRoutes)
app.use('/api/vendor', vendorRouter)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
