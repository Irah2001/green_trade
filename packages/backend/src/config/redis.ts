import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: 3,
  tls: redisUrl.startsWith('rediss://') ? { rejectUnauthorized: false } : undefined,
});

redis.on('connect', () => {
  console.log('🟢 Connecté à Redis avec succès');
});

redis.on('error', (err) => {
  console.error('🔴 Erreur de connexion Redis:', err);
});

export default redis;
