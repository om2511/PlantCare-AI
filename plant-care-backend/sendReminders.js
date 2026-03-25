const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { initWebPush, sendDailyPlantReminders } = require('./services/notificationService');

dotenv.config();

const run = async () => {
  try {
    await connectDB();
    initWebPush();
    await sendDailyPlantReminders();
    process.exit(0);
  } catch (error) {
    console.error('Reminder runner failed:', error);
    process.exit(1);
  }
};

run();
