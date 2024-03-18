import {Router } from 'express'
import { ProjectController } from '../controllers/project.controller'
import { authMiddleware } from '../middlewares/auth.middleware'
const router = Router()

router.post('/create-project', authMiddleware, ProjectController.create)
router.get('/get-project/:projectId',authMiddleware, ProjectController.getProject)
export default router