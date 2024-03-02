import {Router} from 'express'
import { UserController } from '../controllers/user.controller';
import {Request, Response} from 'express'
const router = Router();

router.post('/invitation', UserController.generateInvitation)

export default router