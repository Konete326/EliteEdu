const parseUserAgent = (uaString) => {
  if (!uaString || typeof uaString !== 'string') return '—';
  const ua = uaString.toLowerCase();

  let browser = 'Unknown Browser';
  if (ua.includes('edg/')) browser = 'Edge';
  else if (ua.includes('chrome') && !ua.includes('edg/')) browser = 'Chrome';
  else if (ua.includes('safari') && !ua.includes('chrome')) browser = 'Safari';
  else if (ua.includes('firefox')) browser = 'Firefox';
  else if (ua.includes('opera') || ua.includes('opr/')) browser = 'Opera';

  let os = 'Unknown OS';
  if (ua.includes('windows nt 10') || ua.includes('windows')) os = 'Windows';
  else if (ua.includes('macintosh') || ua.includes('mac os x')) os = 'macOS';
  else if (ua.includes('iphone') || ua.includes('ipad')) os = 'iOS';
  else if (ua.includes('android')) os = 'Android';
  else if (ua.includes('linux')) os = 'Linux';

  if (browser === 'Unknown Browser' && os === 'Unknown OS') return '—';
  return `${browser} · ${os}`;
};

const extractClientIp = (req) => {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    const raw = forwarded.split(',')[0].trim();
    if (raw && raw !== '::1' && raw !== '127.0.0.1') return raw.replace(/^::ffff:/, '');
  }
  const remote = req.socket?.remoteAddress || req.ip;
  if (!remote || remote === '::1' || remote === '127.0.0.1') return '10.0.0.2';
  return remote.replace(/^::ffff:/, '');
};

module.exports = { parseUserAgent, extractClientIp };
