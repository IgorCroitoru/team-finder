import { InvitationController } from "../controllers/invitation.controller";
import {Router} from 'express'
import { authMiddleware } from "../middlewares/auth.middleware";
const router = Router();

router.get('/validate/:token', InvitationController.validate);
router.post('/validate/:token', InvitationController.validate);

export default router