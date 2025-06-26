const express = require('express');
const dotenv = require('dotenv');
const {  initDB } = require('./config/db.js'); // ✅ Fix this line
const rateLimiter = require('./middleware/rateLimiter.js');
const transactionsRoute = require('./routes/transactionsRoute.js');
import job from './config/cron.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV === 'production') job.start(); 

app.use(rateLimiter)
app.use(express.json());


app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Server is healthy" });
})

app.use('/api/transaction', transactionsRoute);

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
