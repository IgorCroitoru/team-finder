import {Router} from 'express'
import { UserController } from '../controllers/user.controller';
import {Request, Response} from 'express'
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleUpdateValidator } from '../middlewares/validators/actions.validation';
import { UserModel } from '../models/user.model';
import { ProjectController } from '../controllers/project.controller';
const router = Router();
//-----------------------------------------------------------------------------------//
//for my routes
router.get('/refresh', authMiddleware,UserController.refresh)
router.post('/logout',UserController.logout)
router.get('/me',authMiddleware, UserController.me)
router.post('/assign-skill', authMiddleware, UserController.assignSkill)
router.get('/my-skills', authMiddleware, UserController.userSkills)
router.delete('/remove-skill/:skillId', authMiddleware, UserController.removeSkill)
router.get('/my-projects', authMiddleware)
//------------------------------------------------------------------------------------//

//routes for managers/admins...
router.get('/:userId/skills', authMiddleware, UserController.userSkills) // route for getting a specific user skills. Accessible for dep. manager so far
router.get('/my-projects', authMiddleware,ProjectController.getCreatedProjects)
export default router;