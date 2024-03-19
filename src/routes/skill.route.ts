import {Router } from 'express'
import { SkillController } from '../controllers/skill.controller'
import { authMiddleware } from '../middlewares/auth.middleware'
const router = Router()

router.post('/create-category', authMiddleware,SkillController.createCategory)
router.get('/find-category', authMiddleware, SkillController.findCategory)
router.post('/create-skill', authMiddleware, SkillController.createSkill)
//route for department manager to get skills from his department
router.get('/get-skills',authMiddleware,SkillController.getSkills)
router.delete('/delete-category', authMiddleware, SkillController.deleteCategory)
router.put('/update-category', authMiddleware, SkillController.updateCategory)
export default router