import dotenv from 'dotenv/config';
import mongoose from 'mongoose';
import express, { response } from 'express'
import cookieParser from 'cookie-parser'
import Fingerprint from "express-fingerprint";
import { IUser } from './src/shared/interfaces/user.interface';
import { Experience, RoleType, SkillLevel } from './src/shared/enums';
import { UserDto } from './src/shared/dtos/user.dto';
import errorMiddleware from './src/middlewares/errorMiddleWare'
import authRoute from './src/routes/auth.route'
import Routes from "./src/routes"
import cors from 'cors'
import { deserialize } from './src/middlewares/deserialization';
import { AdminService } from './src/services/admin.service';
import { ITeamRole } from './src/shared/interfaces/teamrole.interface';
import { UserModel } from './src/models/user.model';
import { Skill, UserSkill } from './src/models/skill.model';
import { parseExperience} from './src/shared/utils';
import { resolve } from 'path';
import { IUserSkill } from './src/shared/interfaces/skill.interface';

const app = express();
const PORT = process.env.PORT || 3000;

const apiRoutes = express.Router();
// origin: 'https://atc-2024-codebros-fe-linux-web-app.azurewebsites.net'
const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};
app.use((req, res, next) => {
  // Get the origin of the request
  const origin = req.headers.origin;

  if (origin) {
    // Set the Access-Control-Allow-Origin header to the requesting origin
    res.setHeader('Access-Control-Allow-Origin', origin);
    // Allow credentials
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }

  // Set other CORS headers as needed
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  // If it's a preflight (OPTIONS) request, respond with 204 'No Content'
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  next();
});

//app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
//app.use(deserialize);

apiRoutes.use('/auth',Routes.authRoute)
apiRoutes.use('/admin',Routes.adminRoute)
apiRoutes.use('/user', Routes.userRoute);
apiRoutes.use('/token',Routes.invRoute )
apiRoutes.use('/department', Routes.departmentRoutes)
apiRoutes.use('/organization', Routes.organizationRoutes)
apiRoutes.use('/skill', Routes.skillRoutes)
apiRoutes.use('/project', Routes.projectRouter)
app.use('/api',apiRoutes)
app.use(errorMiddleware);

mongoose.connect(String(process.env.REMOTE_MONGO))
mongoose.set('debug', true)
app.listen(PORT, () => {
  console.log("Server started on port: ", PORT);
  
});


