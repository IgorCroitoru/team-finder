import {Router } from 'express'
import { SkillController } from '../controllers/skill.controller'
import { authMiddleware } from '../middlewares/auth.middleware'
const router = Router()

router.post('/create-category', authMiddleware,SkillController.createCategory)
router.get('/find-category', authMiddleware, SkillController.findCategory)
router.post('/create-skill', authMiddleware, SkillController.createSkill)
export default router