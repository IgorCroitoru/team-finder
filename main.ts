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
import { deserialize } from './src/middlewares/deserialization';
import { AdminService } from './src/services/admin.service';
import { ITeamRole } from './src/shared/interfaces/teamrole.interface';

const app = express();
const PORT = process.env.PORT || 3000;

const apiRoutes = express.Router();

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
//app.use(deserialize);

apiRoutes.use('/auth',Routes.authRoute)
apiRoutes.use('/admin',Routes.adminRoute)
apiRoutes.use('/user', Routes.userRoute);
apiRoutes.use('/token',Routes.invRoute )
apiRoutes.use('/department', Routes.departmentRoutes)
apiRoutes.use('/organization', Routes.organizationRoutes)
app.use('/api',apiRoutes)
app.use(errorMiddleware);

mongoose.connect(String(process.env.REMOTE_MONGO))
mongoose.set('debug', true)
app.listen(PORT, () => {
  console.log("Server started on port: ", PORT);
});