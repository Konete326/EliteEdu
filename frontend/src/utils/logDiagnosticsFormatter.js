export const formatDiagnosticReport = (log) => {
  if (!log) return '';
  const dateStr = log.createdAt ? new Date(log.createdAt).toISOString() : new Date().toISOString();
  return [
    '=== SYSTEM TELEMETRY & ERROR REPORT ===',
    `Log ID: ${log._id}`,
    `Timestamp: ${dateStr}`,
    `Severity: ${log.severity || 'ERROR'} | Category: ${log.category}`,
    `School: ${log.school_name || 'Global / System'} (${log.school_id || 'N/A'})`,
    `User: ${log.user_name || 'Anonymous'} [${log.user_role || 'Guest'}] (${log.user_id || 'N/A'})`,
    `Page URL: ${log.page_url || 'N/A'}`,
    `Last Clicked Action: ${log.last_clicked_element || 'None'}`,
    `Endpoint: ${log.method || 'GET'} ${log.endpoint || 'N/A'}`,
    `Status Code: ${log.status_code || 'N/A'}`,
    `Message: ${log.message}`,
    log.stack_trace ? `\n--- STACK TRACE ---\n${log.stack_trace}` : '',
    log.metadata && Object.keys(log.metadata).length ? `\n--- METADATA ---\n${JSON.stringify(log.metadata, null, 2)}` : ''
  ].filter(Boolean).join('\n');
};

export const getExpiresInDays = (createdAt) => {
  if (!createdAt) return '7d';
  const created = new Date(createdAt).getTime();
  const expiresAt = created + (7 * 24 * 60 * 60 * 1000);
  const diffHours = Math.max(0, Math.floor((expiresAt - Date.now()) / (1000 * 60 * 60)));
  if (diffHours < 24) return `${diffHours}h left`;
  const days = Math.ceil(diffHours / 24);
  return `${days}d left`;
};
