import dotenv from 'dotenv/config';
import mongoose from 'mongoose';
import express, { response } from 'express'
import cookieParser from 'cookie-parser'
import Fingerprint from "express-fingerprint";
import { IUser } from './src/shared/interfaces/user.interface';
import { RoleType } from './src/shared/enums';
import { UserDto } from './src/shared/dtos/user.dto';
import errorMiddleware from './src/middlewares/errorMiddleWare'
import authRoute from './src/routes/auth.route'
import Routes from "./src/routes"
import cors from 'cors'

const app = express();
const PORT = process.env.PORT || 3000;

//app.use(cors({credentials:true, origin: "*"}))
app.use((req, res, next) => {
  const origin = req.headers.origin;

  // Allow any origin if it's specified in the request
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  next();
});
app.use(cookieParser());
app.use(express.json());
app.use(Fingerprint());
app.use('/auth',Routes.authRoute)
app.use('/admin',Routes.adminRoute )
app.use('/user', Routes.userRoute);
app.use(errorMiddleware);

mongoose.connect(String(process.env.REMOTE_MONGO))
mongoose.set('debug', true)
app.listen(PORT, () => {
  console.log("Server started on port: ", PORT);
});