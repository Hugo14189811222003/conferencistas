const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const { authenticate, requireRole } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

router.use(authenticate, requireRole('admin'));

router.get('/dashboard', adminController.getAdminDashboard);

router.get('/usuarios', adminController.getUsuarios);
router.post('/usuarios', [
    body('nombre').trim().notEmpty().withMessage('El nombre es requerido'),
    body('gmail').trim().isEmail().withMessage('Correo inválido'),
    body('password').notEmpty().isLength({ min: 6 }).withMessage('Contraseña mínima 6 caracteres'),
    body('role').optional().isIn(['admin', 'user']).withMessage('Rol inválido')
], validate, adminController.createUsuario);
router.put('/usuarios/:id', [
    param('id').isInt({ min: 1 }),
    body('nombre').optional().trim().isLength({ max: 255 }),
    body('role').optional().isIn(['admin', 'user'])
], validate, adminController.updateUsuario);
router.delete('/usuarios/:id', [param('id').isInt({ min: 1 })], validate, adminController.deleteUsuario);

router.get('/categorias', adminController.getCategorias);
router.post('/categorias', [
    body('nombre').trim().notEmpty().withMessage('El nombre es requerido')
], validate, adminController.createCategoria);
router.put('/categorias/:id', [
    param('id').isInt({ min: 1 }),
    body('nombre').trim().notEmpty().withMessage('El nombre es requerido')
], validate, adminController.updateCategoria);
router.delete('/categorias/:id', [param('id').isInt({ min: 1 })], validate, adminController.deleteCategoria);

router.get('/lugares', adminController.getLugares);
router.post('/lugares', adminController.createLugar);
router.put('/lugares/:id', [param('id').isInt({ min: 1 })], validate, adminController.updateLugar);
router.delete('/lugares/:id', [param('id').isInt({ min: 1 })], validate, adminController.deleteLugar);

router.get('/asistentes', adminController.getAsistentes);
router.delete('/asistentes/:id', [param('id').isInt({ min: 1 })], validate, adminController.deleteAsistente);

module.exports = router;
