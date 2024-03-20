import {Router} from 'express'
import { UserController } from '../controllers/user.controller';
import {Request, Response} from 'express'
import UserValidators from '../middlewares/validators/auth.validation'
import { AdminController } from '../controllers/admin.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
const router = Router();

router.post('/', UserValidators.validateUserSignup ,UserController.register)
router.post('/admin',UserValidators.validateAdminSignUp ,AdminController.adminRegistration)
router.post('/signin', UserController.login)


export default router;