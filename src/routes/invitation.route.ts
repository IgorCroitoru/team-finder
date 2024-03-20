import { InvitationController } from "../controllers/invitation.controller";
import {Router} from 'express'
import { authMiddleware } from "../middlewares/auth.middleware";
import authorization from '../middlewares/authorization/role.authorization'

const router = Router();

router.get('/validate/:token', InvitationController.validate);
router.post('/validate/:token', InvitationController.validate);

export default router