const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/** Convert a base64url string to a Uint8Array (required by pushManager.subscribe) */
const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
};

/** Register the service worker */
export const registerSW = async () => {
  if (!('serviceWorker' in navigator)) return null;
  try {
    const reg = await navigator.serviceWorker.register('/service-worker.js');
    console.log('✅ Service Worker registered');
    return reg;
  } catch (err) {
    console.error('SW registration failed:', err);
    return null;
  }
};

/** Return current notification permission state */
export const getPermissionStatus = () => {
  if (!('Notification' in window)) return 'denied';
  return Notification.permission; // 'default' | 'granted' | 'denied'
};

/** Subscribe the user to push notifications and save the subscription to the backend */
export const subscribeToNotifications = async () => {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    throw new Error('Push notifications are not supported in this browser');
  }

  if (!('Notification' in window)) {
    throw new Error('Notification API is not available in this browser');
  }

  // Request permission from a user action context (for reliability in modern browsers)
  if (Notification.permission !== 'granted') {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      throw new Error('Notification permission was not granted');
    }
  }

  // 1. Fetch VAPID public key
  const keyRes = await fetch(`${API_URL}/notifications/vapid-key`);
  const keyPayload = await keyRes.json();
  if (!keyRes.ok || !keyPayload?.publicKey) {
    throw new Error(keyPayload?.message || 'Failed to fetch VAPID public key');
  }
  const { publicKey } = keyPayload;

  // 2. Wait for the service worker to be ready
  const registration = await navigator.serviceWorker.ready;
  const token = localStorage.getItem('token');

  const saveSubscription = async (subscription) => {
    const saveRes = await fetch(`${API_URL}/notifications/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(subscription.toJSON())
    });
    if (!saveRes.ok) {
      const savePayload = await saveRes.json().catch(() => ({}));
      throw new Error(savePayload?.message || 'Failed to save push subscription');
    }
  };

  // If already subscribed, re-sync it to backend in case server records were lost
  const existingSubscription = await registration.pushManager.getSubscription();
  if (existingSubscription) {
    await saveSubscription(existingSubscription);
    console.log('✅ Existing push subscription re-synced');
    return existingSubscription;
  }

  // 3. Subscribe via the Push API (will prompt user for permission if 'default')
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey)
  });

  // 4. Send subscription to our backend
  await saveSubscription(subscription);

  console.log('✅ Push subscription saved');
  return subscription;
};

/** Unsubscribe the user from push notifications */
export const unsubscribeFromNotifications = async () => {
  if (!('serviceWorker' in navigator)) return;

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();

  if (!subscription) return;

  const endpoint = subscription.endpoint;
  await subscription.unsubscribe();

  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/notifications/unsubscribe`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ endpoint })
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload?.message || 'Failed to unsubscribe from push notifications');
  }

  console.log('✅ Unsubscribed from push notifications');
};
