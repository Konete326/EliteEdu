const clients = new Map();

const getClientKey = (schoolId, userId) => `${String(schoolId)}:${String(userId)}`;

const subscribeClient = (req, res) => {
  const schoolId = req.user?.school_id;
  const userId = req.user?.id || req.user?._id;

  if (!schoolId || !userId) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no'
  });

  const key = getClientKey(schoolId, userId);
  if (!clients.has(key)) clients.set(key, new Set());
  clients.get(key).add(res);

  res.write(`event: connected\ndata: ${JSON.stringify({ userId, connectedAt: new Date() })}\n\n`);

  const heartbeat = setInterval(() => {
    try {
      res.write(': keepalive\n\n');
    } catch {
      clearInterval(heartbeat);
    }
  }, 25000);

  const cleanup = () => {
    clearInterval(heartbeat);
    const set = clients.get(key);
    if (set) {
      set.delete(res);
      if (set.size === 0) clients.delete(key);
    }
  };

  req.on('close', cleanup);
  res.on('error', cleanup);
};

const emitChatEvent = (schoolId, userIds, eventType, payload) => {
  const data = `event: ${eventType}\ndata: ${JSON.stringify(payload)}\n\n`;

  if (!userIds || userIds === '*') {
    clients.forEach((set, key) => {
      if (key.startsWith(`${String(schoolId)}:`)) {
        set.forEach((res) => {
          try {
            res.write(data);
          } catch {
            set.delete(res);
          }
        });
      }
    });
    return;
  }

  const targets = Array.isArray(userIds) ? userIds : [userIds];
  targets.forEach((uid) => {
    const key = getClientKey(schoolId, uid);
    const set = clients.get(key);
    if (set) {
      set.forEach((res) => {
        try {
          res.write(data);
        } catch {
          set.delete(res);
        }
      });
    }
  });
};

module.exports = {
  subscribeClient,
  emitChatEvent
};
