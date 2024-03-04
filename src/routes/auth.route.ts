import {Router} from 'express'
import { UserController } from '../controllers/user.controller';
import {Request, Response} from 'express'
const router = Router();

router.post('/', UserController.register)
router.post('/admin', UserController.adminRegistration)
router.post('/signin', UserController.login)

export default router;