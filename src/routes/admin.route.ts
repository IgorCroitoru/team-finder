import {Router} from 'express'
import { UserController } from '../controllers/user.controller';
import {Request, Response} from 'express'
import { AdminController } from '../controllers/admin.controller';
import { roleUpdateValidator } from '../middlewares/validators/actions.validation';
const router = Router();

router.post('/invitation',  AdminController.generateInvitation)
router.get('/my-users', AdminController.getUsers)
router.put('/set-role', roleUpdateValidator, AdminController.setRole)
router.put('/delete-role', roleUpdateValidator, AdminController.deleteRole)
router.get('/some',(req: Request, res: Response)=> {
    res.json({ok: 'dadadad'})
})

export default router