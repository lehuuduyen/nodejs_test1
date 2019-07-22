const express = require('express');
const router = express.Router();
const characterController = require('../controller/characterController');
const {characterValidation} = require('../formValidation/characterValidation');

router.get('/', characterController.index);
router.post('/store', characterValidation('store'), characterController.store);
router.get('/:id', characterController.detail);
router.post('/:id/update', characterValidation('update'), characterController.update);
router.get('/:id/delete', characterController.delete);

module.exports = router;