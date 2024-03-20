import {Router } from 'express'
import { SkillController } from '../controllers/skill.controller'
import { authMiddleware } from '../middlewares/auth.middleware'
import authorization from '../middlewares/authorization/role.authorization'
const router = Router()

router.post('/create-category', authMiddleware, authorization(['DEPARTMENT_MANAGER']), SkillController.createCategory)
router.get('/find-category', authMiddleware, SkillController.findCategory)
router.post('/create-skill', authMiddleware, authorization(['DEPARTMENT_MANAGER']), SkillController.createSkill)
//route for department manager to get skills from his department
router.get('/get-skills',authMiddleware, authorization(['DEPARTMENT_MANAGER']),SkillController.getSkills)
router.delete('/delete-category', authMiddleware,authorization(['DEPARTMENT_MANAGER', 'ADMIN']), SkillController.deleteCategory)
router.put('/update-category', authMiddleware, authorization(['DEPARTMENT_MANAGER', 'ADMIN']), SkillController.updateCategory)
export default router