import {Router} from 'express';
import {authRequired} from '../middlewares/validateToken.js';

const router = Router();

router.get('/pays', authRequired, (req, res) => res.send('pays'));

export default router;