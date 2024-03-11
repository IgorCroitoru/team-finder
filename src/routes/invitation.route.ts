import { InvitationController } from "../controllers/invitation.controller";
import {Router} from 'express'
import { authMiddleware } from "../middlewares/auth.middleware";
const router = Router();

router.get('/validate/:token', authMiddleware, InvitationController.validate);
router.post('/validate/:token', authMiddleware, InvitationController.validate);

export default router