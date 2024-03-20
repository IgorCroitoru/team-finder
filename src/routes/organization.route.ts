import {Router } from 'express'
import { OrganizationController } from '../controllers/organization.controller'
import { authMiddleware } from '../middlewares/auth.middleware'
import authorization from '../middlewares/authorization/role.authorization'

const router = Router()

router.get('/users', authMiddleware, OrganizationController.getUsers)
router.get('/non-department-users', authMiddleware, OrganizationController.getNoneDepartmentUsers)
router.get('/get-departments', authMiddleware, OrganizationController.getDepartments)
export default router
