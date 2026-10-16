const query = require('./systemLogQueryController');
const mutation = require('./systemLogMutationController');

module.exports = {
  getSystemLogs: query.getSystemLogs,
  ingestTelemetry: mutation.ingestTelemetry,
  deleteSingleLog: mutation.deleteSingleLog,
  clearLogs: mutation.clearLogs
};
