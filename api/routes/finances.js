const express = require('express');
const router = express.Router();
const financeController = require('../controllers/financeController');

router.get('/', financeController.getAllFinances);
router.post('/', financeController.createFinance);
router.put('/:id', financeController.updateFinance);
router.delete('/:id', financeController.deleteFinance);

module.exports = router;
