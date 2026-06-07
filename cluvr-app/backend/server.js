import app from './app.js';
import dbConnect from './db.js';
import config from './config/index.js';

// Connect to database
dbConnect();

// Start server
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});