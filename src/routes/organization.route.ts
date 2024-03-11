import {Router } from 'express'
import { OrganizationController } from '../controllers/organization.controller'
import { authMiddleware } from '../middlewares/auth.middleware'
const router = Router()

router.get('/users', authMiddleware, OrganizationController.getUsers)

export default router
