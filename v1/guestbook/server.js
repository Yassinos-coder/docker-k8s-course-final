const express = require('express');
const path = require('path');
const { createClient } = require('redis');

const app = express();
const PORT = process.env.PORT || 3000;
const REDIS_HOST = process.env.REDIS_MASTER_SERVICE_HOST;
const REDIS_PORT = process.env.REDIS_MASTER_SERVICE_PORT || '6379';
const ENTRIES_KEY = 'guestbook:entries';

const memoryEntries = [];
let redisClient = null;
let redisConnected = false;

async function connectRedis() {
  if (!REDIS_HOST) return;

  redisClient = createClient({ socket: { host: REDIS_HOST, port: Number(REDIS_PORT) } });
  redisClient.on('error', (err) => {
    redisConnected = false;
    console.error('Redis connection error:', err.message);
  });

  try {
    await redisClient.connect();
    redisConnected = true;
    console.log(`Connected to Redis at ${REDIS_HOST}:${REDIS_PORT}`);
  } catch (err) {
    redisConnected = false;
    console.error('Failed to connect to Redis:', err.message);
  }
}

connectRedis();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/info', async (req, res) => {
  if (redisConnected) {
    const entryCount = await redisClient.lLen(ENTRIES_KEY);
    return res.json({
      datastore: `Redis at ${REDIS_HOST}:${REDIS_PORT}`,
      connected: true,
      entryCount,
    });
  }

  res.json({
    datastore: 'In-memory datastore (not redis)',
    connected: false,
    entryCount: memoryEntries.length,
  });
});

app.get('/entries', async (req, res) => {
  if (redisConnected) {
    const entries = await redisClient.lRange(ENTRIES_KEY, 0, -1);
    return res.json(entries);
  }

  res.json(memoryEntries);
});

app.post('/entries', async (req, res) => {
  const text = (req.body.text || '').trim();
  if (!text) return res.status(400).json({ error: 'text is required' });

  if (redisConnected) {
    await redisClient.rPush(ENTRIES_KEY, text);
    return res.status(201).json({ text });
  }

  memoryEntries.push(text);
  res.status(201).json({ text });
});

app.listen(PORT, () => {
  console.log(`Guestbook app listening on port ${PORT}`);
});
