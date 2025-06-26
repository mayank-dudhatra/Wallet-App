const express = require('express');
const { sql } = require('../config/db.js'); 
const { getTransactionsByUserId, createTransaction, deleteTransaction, getSummaryByUserId } = require('../controllers/transactionsController.js');
require('dotenv').config(); 

const router = express.Router();


router.get('/:userId', getTransactionsByUserId )
router.post('/', createTransaction )
router.delete('/:id', deleteTransaction)
router.get('/summary/:userId', getSummaryByUserId)


module.exports = router;
