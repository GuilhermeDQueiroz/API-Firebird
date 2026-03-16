const express = require('express');
const router = express.Router();

const genericController = require('../controllers/genericController');

router.get('/:tabela', genericController.listar);
router.get('/:tabela/:id', genericController.buscarPorId);

module.exports = router;