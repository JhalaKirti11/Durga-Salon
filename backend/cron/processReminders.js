const cron = require('node-cron');
const reminderService = require('../services/reminderService');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/durga-salon';

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected for reminder processing');
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Process reminders every 5 minutes
const processRemindersJob = cron.schedule('*/5 * * * *', async () => {
  try {
    console.log(`[${new Date().toISOString()}] Processing pending reminders...`);
    await reminderService.processPendingReminders();
    console.log(`[${new Date().toISOString()}] Reminder processing completed`);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error processing reminders:`, error);
  }
}, {
  scheduled: false // Don't start automatically
});

// Process reminders every hour (for less frequent processing)
const hourlyRemindersJob = cron.schedule('0 * * * *', async () => {
  try {
    console.log(`[${new Date().toISOString()}] Processing hourly reminders...`);
    await reminderService.processPendingReminders();
    console.log(`[${new Date().toISOString()}] Hourly reminder processing completed`);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error processing hourly reminders:`, error);
  }
}, {
  scheduled: false // Don't start automatically
});

// Manual processing function
const processRemindersManually = async () => {
  try {
    console.log(`[${new Date().toISOString()}] Manual reminder processing started...`);
    await reminderService.processPendingReminders();
    console.log(`[${new Date().toISOString()}] Manual reminder processing completed`);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error in manual reminder processing:`, error);
  }
};

// Start the job
const startReminderProcessing = () => {
  console.log('Starting reminder processing cron job...');
  processRemindersJob.start();
  console.log('Reminder processing cron job started (every 5 minutes)');
};

// Stop the job
const stopReminderProcessing = () => {
  console.log('Stopping reminder processing cron job...');
  processRemindersJob.stop();
  console.log('Reminder processing cron job stopped');
};

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully...');
  stopReminderProcessing();
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  stopReminderProcessing();
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});

// Export functions for use in other parts of the application
module.exports = {
  startReminderProcessing,
  stopReminderProcessing,
  processRemindersManually,
  processRemindersJob
};

// If this file is run directly, start the processing
if (require.main === module) {
  console.log('Starting reminder processing service...');
  startReminderProcessing();
  
  // Also process immediately
  setTimeout(() => {
    processRemindersManually();
  }, 2000);
} 