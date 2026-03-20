const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { authenticate } = require('../middleware/auth');
const { 
    registerValidation, 
    loginValidation, 
    forgotPasswordValidation,
    resetPasswordValidation,
    updatePerfilValidation 
} = require('../validators');
const authController = require('../controllers/authController');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

router.post('/register', registerValidation, validate, authController.register);

router.post('/login', loginValidation, validate, authController.login);

router.post('/forgot-password', forgotPasswordValidation, validate, authController.forgotPassword);

router.post('/reset-password', resetPasswordValidation, validate, authController.resetPassword);

router.get('/perfil', authenticate, authController.getPerfil);

router.put('/perfil', authenticate, updatePerfilValidation, validate, authController.updatePerfil);

module.exports = router;
