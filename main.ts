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


const app = express();
const PORT = process.env.PORT || 3000;


app.use(cookieParser());
app.use(express.json());
app.use(Fingerprint());
app.use('/auth',Routes.authRoute)
app.use('/admin',Routes.adminRoute )

app.use(errorMiddleware);


mongoose.connect(String(process.env.REMOTE_MONGO))
mongoose.set('debug', true)
app.listen(PORT, () => {
  console.log("Server started");
});