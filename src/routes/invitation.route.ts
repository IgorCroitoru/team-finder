import { InvitationController } from "../controllers/invitation.controller";
import {Router} from 'express'
const router = Router();

router.get('/validate', InvitationController.validate);
router.post('/validate', InvitationController.validate);

export default router