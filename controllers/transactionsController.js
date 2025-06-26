const { sql } = require('../config/db.js');

async function getTransactionsByUserId(req, res) {
    
        try {
            const { userId } = req.params;
            const transactions = await sql`
                SELECT * FROM transaction WHERE user_id = ${userId} ORDER BY created_at DESC
            `;
            res.status(200).json(transactions);
        }
        catch (error) {
            console.error("Error fetching transactions:", error);
            res.status(500).json({ error: 'Internal Server Error' });
        }

}

 async function createTransaction (req, res) {
   
try {
    const { user_id, title, amount, category } = req.body;

    if (!user_id || !title || !amount || !category) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const result = await sql`
      INSERT INTO transaction (user_id, title, amount, category)
      VALUES (${user_id}, ${title}, ${amount}, ${category})
      RETURNING *
    `;
    res.status(201).json(result[0]);
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

}

 async function deleteTransaction(req, res) {

  try {
    const { id } = req.params;

    if(isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Invalid transaction ID' });
    }

    const result = await sql`
      DELETE FROM transaction WHERE id = ${id} RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.status(200).json({ message: 'Transaction deleted successfully', transaction: result[0] });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

}

 async function getSummaryByUserId(req, res) {
  
    try {
        const { userId } = req.params;

        const summary = await sql`
        SELECT COALESCE(SUM(amount),0) as balance FROM transaction WHERE user_id = ${userId};
        `;

        const incomeResult = await sql`
        SELECT COALESCE(SUM(amount),0) as income FROM transaction WHERE user_id = ${userId} AND amount > 0;
        `

        const expensesResult = await sql`
        SELECT COALESCE(SUM(amount),0) as expenses FROM transaction WHERE user_id = ${userId} AND amount < 0;
        `

        res.status(200).json(({
            balance: summary[0].balance,
            income: incomeResult[0].income,
            expenses: expensesResult[0].expenses
        }));

    } catch (error) {
        console.error("Error fetching transaction summary:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

}


module.exports = {
  getTransactionsByUserId,
  createTransaction,
  deleteTransaction,
  getSummaryByUserId,
};

