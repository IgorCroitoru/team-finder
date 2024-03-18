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

const corsOptions = {
  origin: 'https://atc-2024-codebros-fe-linux-web-app.azurewebsites.net',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
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
//apiRoutes.use('/project', Routes.projectRouter)
app.use('/api',apiRoutes)
app.use(errorMiddleware);

mongoose.connect(String(process.env.REMOTE_MONGO))
mongoose.set('debug', true)
app.listen(PORT, () => {
  console.log("Server started on port: ", PORT);
  
});


