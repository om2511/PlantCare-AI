const webpush = require('web-push');
const PushSubscription = require('../models/PushSubscription');
const Plant = require('../models/Plant');

/**
 * Configure web-push with VAPID credentials
 */
const initWebPush = () => {
  webpush.setVapidDetails(
    process.env.VAPID_EMAIL,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
};

/**
 * Send a push notification to all subscriptions for a user.
 * Automatically removes stale subscriptions (410/404 responses).
 */
const sendToUser = async (userId, payload) => {
  const subscriptions = await PushSubscription.find({ userId });
  if (!subscriptions.length) return;

  const payloadStr = JSON.stringify(payload);

  await Promise.all(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: sub.keys },
          payloadStr
        );
      } catch (err) {
        if (err.statusCode === 410 || err.statusCode === 404) {
          // Subscription is no longer valid — remove it
          await PushSubscription.deleteOne({ _id: sub._id });
          console.log('🗑️ Removed stale push subscription:', sub.endpoint.slice(-20));
        } else {
          console.error('Push send error:', err.message);
        }
      }
    })
  );
};

/**
 * Cron job: send daily watering / fertilizing reminders.
 * Called at 8:00 AM IST (2:30 AM UTC) every day.
 */
const sendDailyPlantReminders = async () => {
  console.log('⏰ Running daily plant reminder notifications...');
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const plants = await Plant.find({
      isActive: true,
      $or: [
        { 'careSchedule.nextWateringDue': { $lte: today } },
        { 'careSchedule.nextFertilizingDue': { $lte: today } }
      ]
    });

    console.log(`🌿 Found ${plants.length} plants needing reminders`);

    for (const plant of plants) {
      const needsWater = plant.careSchedule?.nextWateringDue && plant.careSchedule.nextWateringDue <= today;
      const needsFertilizer = plant.careSchedule?.nextFertilizingDue && plant.careSchedule.nextFertilizingDue <= today;

      if (needsWater) {
        await sendToUser(plant.userId, {
          title: '💧 Time to Water!',
          body: `${plant.species} needs watering today.`,
          data: { url: `/plants/${plant._id}` }
        });
      }

      if (needsFertilizer) {
        await sendToUser(plant.userId, {
          title: '🌿 Fertilizing Due!',
          body: `${plant.species} is due for fertilizing today.`,
          data: { url: `/plants/${plant._id}` }
        });
      }
    }

    console.log('✅ Daily plant reminders sent');
  } catch (err) {
    console.error('Daily reminder error:', err);
  }
};

module.exports = { initWebPush, sendToUser, sendDailyPlantReminders };
