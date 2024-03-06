import {Router} from 'express'
import { UserController } from '../controllers/user.controller';
import {Request, Response} from 'express'
const router = Router();

router.get('/refresh', UserController.refresh)
router.post('/logout', UserController.logout)

export default router;