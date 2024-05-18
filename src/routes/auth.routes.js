import {Router} from 'express';
import {register, login, logout, profile, pagoPlux} from '../controllers/auth.controller.js';
import {authRequired} from '../middlewares/validateToken.js';

// Vamos agregar las rutas
const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
// En cuanto a esta ruta solo será accesible una vez se valide el token
router.get('/profile', authRequired, profile);
// Ruta para obtener transacciones de PagoPlux
router.post('/pagoPlux', pagoPlux);

export default router;