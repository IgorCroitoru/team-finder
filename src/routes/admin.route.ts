import {Router} from 'express'
import { UserController } from '../controllers/user.controller';
import {Request, Response} from 'express'
import { AdminController } from '../controllers/admin.controller';
const router = Router();

router.post('/invitation',  AdminController.generateInvitation)
router.get('/my-users', AdminController.getUsers)
router.get('/some',(req: Request, res: Response)=> {
    res.json({ok: 'dadadad'})
})

export default router