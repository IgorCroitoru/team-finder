import {Router} from 'express'
import { DepartmentController } from '../controllers/department.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
const router = Router();

router.post('/create', authMiddleware, DepartmentController.create)
router.put('/:departmentId/set-manager',authMiddleware, DepartmentController.setManager)
router.put('/:departmentId/delete-manager',authMiddleware, DepartmentController.deleteManager)
router.delete('/delete-department/:departmentId', authMiddleware, DepartmentController.deleteDepartment)
router.get('/:departmentId/get-employees', authMiddleware, DepartmentController.getEmployees)
router.post('/:departmentId/add-user',authMiddleware,DepartmentController.addUser)
router.put('/:departmentId/delete-user',authMiddleware,DepartmentController.deleteUser)
router.put('/add-skill', authMiddleware, DepartmentController.assignSkill)
router.put('/delete-skill', authMiddleware, DepartmentController.deleteSkill)
export default router