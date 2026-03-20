const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const { authenticate, optionalAuth } = require('../middleware/auth');
const { eventoValidation, asistenteValidation, idValidation } = require('../validators');
const eventosController = require('../controllers/eventosController');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

router.get('/categorias', eventosController.getCategorias);

router.get('/lugares', eventosController.getLugares);

router.get('/', optionalAuth, eventosController.getAllEventos);

router.get('/mis-eventos', authenticate, eventosController.getMyEventos);

router.get('/:id', optionalAuth, idValidation, validate, eventosController.getEventoById);

router.post('/', authenticate, eventoValidation, validate, eventosController.createEvento);

router.put('/:id', authenticate, [...idValidation, ...eventoValidation], validate, eventosController.updateEvento);

router.delete('/:id', authenticate, idValidation, validate, eventosController.deleteEvento);

router.post('/:id/participar', [...idValidation, ...asistenteValidation], validate, eventosController.participar);

router.get('/:id/asistentes', authenticate, idValidation, validate, eventosController.getAsistentes);

module.exports = router;
