import {Router } from 'express'
import { ProjectController } from '../controllers/project.controller'
import { TeamFinderController } from '../controllers/team-finder.controller'
import { authMiddleware } from '../middlewares/auth.middleware'
import authorization from '../middlewares/authorization/role.authorization'

const router = Router()

router.post('/create-project', authMiddleware, ProjectController.create)
router.get('/get-project/:projectId',authMiddleware, ProjectController.getProject)
router.delete('/delete-project/:projectId', authMiddleware, ProjectController.deleteProject)
router.get('/:projectId/find-team',authMiddleware, TeamFinderController.findTeam)
router.post('/:projectId/propose-employee',authMiddleware, ProjectController.proposeEmployee)
export default router