import {Router} from 'express'
import { DepartmentController } from '../controllers/department.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import authorization from '../middlewares/authorization/role.authorization'

const router = Router();

router.post('/create', authMiddleware, authorization(['ADMIN']),DepartmentController.create)
router.put('/:departmentId/set-manager',authMiddleware,authorization(['ADMIN']), DepartmentController.setManager)
router.put('/:departmentId/delete-manager',authMiddleware, authorization(['ADMIN']),DepartmentController.deleteManager)
router.delete('/delete-department/:departmentId', authMiddleware, authorization(['ADMIN']),DepartmentController.deleteDepartment)
router.get('/:departmentId/get-employees', authMiddleware,authorization(['ADMIN', 'DEPARTMENT_MANAGER']), DepartmentController.getEmployees)
router.post('/:departmentId/add-user',authMiddleware,authorization(['DEPARTMENT_MANAGER']),DepartmentController.addUser)
router.put('/:departmentId/delete-user',authMiddleware,authorization(['DEPARTMENT_MANAGER']),DepartmentController.deleteUser)
router.put('/add-skill', authMiddleware, authorization(['DEPARTMENT_MANAGER']),DepartmentController.assignSkill)
router.put('/delete-skill', authMiddleware, authorization(['DEPARTMENT_MANAGER']),DepartmentController.deleteSkill)
//for dep. manager
router.get('/:departmentId/projects', authMiddleware,authorization(['DEPARTMENT_MANAGER']),DepartmentController.getProjectsFromDepartment)
export default router