import dotenv from 'dotenv';
import mongoose from 'mongoose';
import express, { response } from 'express'
import cookieParser from 'cookie-parser'
import Fingerprint from "express-fingerprint";
import { IUser } from './src/shared/interfaces/user.interface';
import {UserRepository} from './src/repository/mongo/UserRepository'
import { RoleType } from './src/shared/enums';
import { UserDto } from './src/shared/dtos/user.dto';
import { TokenService } from './src/services/token.service';
import { UserModel } from './src/models/user.model';
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
  roles: [RoleType.ADMIN,RoleType.PROJECT_MANAGER],
  skills: []
}
const userDto = new UserDto(user)

//const tokens = TokenService.generateTokens({...userDto})
//console.log(TokenService.validateAccessToken('fsdf'))
//console.log(userDto)
//console.log(tokens)
mongoose.connect(String(process.env.LOCAL_MONGO))
mongoose.set('debug', true)
//userRepository.findOne({name: user.name, email: user.email, games: 'cs'}).then((response)=>console.log(response)).catch((e)=>console.log(e))
//userRepository.createUser(user).then(()=> {console.log('ss')}).catch((err)=> {console.log(err)})
//userRepository.findByEmail(user.email).then((response)=> {console.log(response)}).catch((err)=>{console.log(err)})
app.listen(PORT, () => {
  console.log("Server started");
});