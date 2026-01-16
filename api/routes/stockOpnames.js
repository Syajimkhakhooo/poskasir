const express = require('express');
const router = express.Router();
const stockOpnameController = require('../controllers/stockOpnameController');

router.get('/', stockOpnameController.getAllStockOpnames);
router.post('/', stockOpnameController.createStockOpname);

module.exports = router;
