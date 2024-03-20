import {Router } from 'express'
import { ProjectController } from '../controllers/project.controller'
import { TeamFinderController } from '../controllers/team-finder.controller'
import { authMiddleware } from '../middlewares/auth.middleware'
import authorization from '../middlewares/authorization/role.authorization'

const router = Router()

router.post('/create-project', authMiddleware, authorization(['PROJECT_MANAGER']),ProjectController.create)
router.get('/get-project/:projectId',authMiddleware,authorization(['PROJECT_MANAGER', 'EMPLOYEE']), ProjectController.getProject)
router.delete('/delete-project/:projectId', authMiddleware, authorization(['PROJECT_MANAGER']),ProjectController.deleteProject)
router.get('/:projectId/find-team',authMiddleware, authorization(['PROJECT_MANAGER']),TeamFinderController.findTeam)
router.post('/:projectId/propose-employee',authMiddleware, authorization(['PROJECT_MANAGER']),ProjectController.proposeEmployee)
export default router