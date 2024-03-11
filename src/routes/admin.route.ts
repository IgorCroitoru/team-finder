import {Router} from 'express'
import { UserController } from '../controllers/user.controller';
import {Request, Response} from 'express'
import { AdminController } from '../controllers/admin.controller';
import { roleUpdateValidator } from '../middlewares/validators/actions.validation';
import { authMiddleware } from '../middlewares/auth.middleware';
const router = Router();

router.post('/invitation',  AdminController.generateInvitation)
router.put('/set-role', roleUpdateValidator, AdminController.setRole)
router.put('/delete-role', roleUpdateValidator, AdminController.deleteRole)
router.get('/some',(req: Request, res: Response)=> {
    res.json({ok: 'dadadad'})
})

export default router