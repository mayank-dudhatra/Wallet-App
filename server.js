// const express = require('express');
// const dotenv = require('dotenv');
// const { initDB } = require('./config/db.js'); // ✅ Fix this line
// const rateLimiter = require('./middleware/rateLimiter.js');
// const transactionsRoute = require('./routes/transactionsRoute.js');
// const job = require('./config/cron.js');

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 3000;

// if (process.env.NODE_ENV === 'production') job.start(); 

// app.use(rateLimiter)
// app.use(express.json());


// app.get("/api/health", (req, res) => {
//   res.status(200).json({ message: "Server is healthy" });
// })

// app.use('/api/transaction', transactionsRoute);

// initDB().then(() => {
//   app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
//   });
// });


const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // ✅ ADD THIS LINE
const { initDB } = require('./config/db.js');
const rateLimiter = require('./middleware/rateLimiter.js');
const transactionsRoute = require('./routes/transactionsRoute.js');
const job = require('./config/cron.js');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ START SCHEDULE JOB IN PROD ONLY
if (process.env.NODE_ENV === 'production') job.start(); 

// ✅ USE CORS BEFORE ROUTES
app.use(cors()); // <- ADD THIS LINE
app.use(rateLimiter);
app.use(express.json());

// ✅ TEST ROUTE
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Server is healthy" });
});

// ✅ ROUTES
app.use('/api/transaction', transactionsRoute);

// ✅ CONNECT TO DB AND START SERVER
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
