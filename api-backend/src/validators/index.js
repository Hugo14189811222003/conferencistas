const { body, param, query } = require('express-validator');

const registerValidation = [
    body('nombre')
        .trim()
        .notEmpty().withMessage('El nombre es requerido')
        .isLength({ max: 255 }).withMessage('El nombre no puede exceder 255 caracteres'),
    body('gmail')
        .trim()
        .notEmpty().withMessage('El correo electrónico es requerido')
        .isEmail().withMessage('Correo electrónico inválido')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('La contraseña es requerida')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('bio')
        .optional()
        .trim()
        .isLength({ max: 1000 }).withMessage('La bio no puede exceder 1000 caracteres')
];

const loginValidation = [
    body('gmail')
        .trim()
        .notEmpty().withMessage('El correo electrónico es requerido')
        .isEmail().withMessage('Correo electrónico inválido')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('La contraseña es requerida')
];

const forgotPasswordValidation = [
    body('gmail')
        .trim()
        .notEmpty().withMessage('El correo electrónico es requerido')
        .isEmail().withMessage('Correo electrónico inválido')
        .normalizeEmail()
];

const resetPasswordValidation = [
    body('token')
        .trim()
        .notEmpty().withMessage('El token es requerido'),
    body('password')
        .notEmpty().withMessage('La contraseña es requerida')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
];

const eventoValidation = [
    body('nombre')
        .trim()
        .notEmpty().withMessage('El nombre del evento es requerido')
        .isLength({ max: 255 }).withMessage('El nombre no puede exceder 255 caracteres'),
    body('descripcion')
        .optional()
        .trim()
        .isLength({ max: 5000 }).withMessage('La descripción no puede exceder 5000 caracteres'),
    body('capacidad')
        .notEmpty().withMessage('La capacidad es requerida')
        .isInt({ min: 1 }).withMessage('La capacidad debe ser un número positivo'),
    body('horario')
        .optional()
        .matches(/^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/).withMessage('Horario inválido (formato: HH:MM)'),
    body('fecha')
        .notEmpty().withMessage('La fecha es requerida')
        .isISO8601().withMessage('Fecha inválida'),
    body('costo_entrada')
        .optional()
        .isFloat({ min: 0 }).withMessage('El costo debe ser un número positivo'),
    body('categorias')
        .optional()
        .isArray().withMessage('Las categorías deben ser un array'),
    body('lugar_id')
        .optional()
        .isInt().withMessage('ID de lugar inválido')
];

const asistenteValidation = [
    body('nombre')
        .trim()
        .notEmpty().withMessage('El nombre es requerido')
        .isLength({ max: 255 }).withMessage('El nombre no puede exceder 255 caracteres'),
    body('email')
        .trim()
        .notEmpty().withMessage('El correo electrónico es requerido')
        .isEmail().withMessage('Correo electrónico inválido')
        .normalizeEmail(),
    body('telefono')
        .optional()
        .trim()
        .isLength({ max: 50 }).withMessage('El teléfono no puede exceder 50 caracteres')
];

const updatePerfilValidation = [
    body('nombre')
        .optional()
        .trim()
        .isLength({ max: 255 }).withMessage('El nombre no puede exceder 255 caracteres'),
    body('bio')
        .optional()
        .trim()
        .isLength({ max: 1000 }).withMessage('La bio no puede exceder 1000 caracteres')
];

const idValidation = [
    param('id')
        .isInt({ min: 1 }).withMessage('ID inválido')
];

module.exports = {
    registerValidation,
    loginValidation,
    forgotPasswordValidation,
    resetPasswordValidation,
    eventoValidation,
    asistenteValidation,
    updatePerfilValidation,
    idValidation
};
