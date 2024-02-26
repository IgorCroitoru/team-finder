import dotenv from 'dotenv';
import mongoose from 'mongoose';
import express from 'express'
import cookieParser from 'cookie-parser'
import Fingerprint from "express-fingerprint";
import { IUser } from './src/shared/interfaces/user.interface';
import {UserRepository} from './src/repository/mongo/UserRepository'
import { RoleType } from './src/shared/enums';
dotenv.config()


const app = express();
const PORT = process.env.PORT || 5000;


app.use(cookieParser());
app.use(express.json());
app.use(Fingerprint());

app.get('*',function(req,res,next) {
  // Fingerprint object
  console.log(req.fingerprint)
})


const userRepository = new UserRepository();
const user: IUser = {
  name: 'david',
  password: 'addssa',
  email: 'mail@mail.com',
  role: [RoleType.ADMIN,RoleType.PROJECT_MANAGER]
}
mongoose.connect(String(process.env.LOCAL_MONGO))
mongoose.set('debug', true)
//userRepository.createUser(user).then(()=> {console.log('ss')}).catch((err)=> {console.log(err)})
//userRepository.findUserByEmail(user.email).then((response)=> {console.log(response)}).catch((err)=>{console.log(err)})
app.listen(PORT, () => {
  console.log("Server started");
});