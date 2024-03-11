import {Router} from 'express'
import { DepartmentController } from '../controllers/department.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
const router = Router();

router.post('/create', authMiddleware, DepartmentController.create)
router.put('/:departmentId/set-manager',authMiddleware, DepartmentController.setManager)
router.put('/:departmentId/delete-manager',authMiddleware, DepartmentController.deleteManager)
router.get('/get-departments', authMiddleware, DepartmentController.getDepartments)
router.delete('/delete-department/:departmentId', authMiddleware, DepartmentController.deleteDepartment)

export default router