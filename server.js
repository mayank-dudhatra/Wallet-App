const express = require('express');
const dotenv = require('dotenv');
const {  initDB } = require('./config/db.js'); // ✅ Fix this line
const rateLimiter = require('./middleware/rateLimiter.js');
const transactionsRoute = require('./routes/transactionsRoute.js');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(rateLimiter)
app.use(express.json());



app.use('/api/transaction', transactionsRoute);

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
