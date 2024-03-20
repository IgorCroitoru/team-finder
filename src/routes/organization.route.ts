import {Router } from 'express'
import { OrganizationController } from '../controllers/organization.controller'
import { authMiddleware } from '../middlewares/auth.middleware'
import authorization from '../middlewares/authorization/role.authorization'

const router = Router()

router.get('/users', authMiddleware, authorization(['ADMIN']),OrganizationController.getUsers)
router.get('/non-department-users', authMiddleware, authorization(['DEPARTMENT_MANAGER', 'ADMIN']),OrganizationController.getNoneDepartmentUsers)
router.get('/get-departments', authMiddleware, authorization(['ADMIN']),OrganizationController.getDepartments)
export default router
