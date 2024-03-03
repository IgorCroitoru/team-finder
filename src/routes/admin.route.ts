import {Router} from 'express'
import { UserController } from '../controllers/user.controller';
import {Request, Response} from 'express'
const router = Router();

router.post('/invitation', UserController.generateInvitation)
router.get('/some',(req: Request, res: Response)=> {
    res.json({ok: 'dadadad'})
})

export default router