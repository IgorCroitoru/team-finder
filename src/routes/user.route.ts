import {Router} from 'express'
import { UserController } from '../controllers/user.controller';
import {Request, Response} from 'express'
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleUpdateValidator } from '../middlewares/validators/actions.validation';
import { UserModel } from '../models/user.model';
const router = Router();

router.get('/refresh', UserController.refresh)
router.post('/logout', UserController.logout)
router.get('/me',authMiddleware, UserController.me)
router.post('/assign-skill', authMiddleware, UserController.assignSkill)
router.get('/my-skills', authMiddleware, UserController.mySkills)
router.delete('/remove-skill/:skillId', authMiddleware, UserController.removeSkill)
export default router;