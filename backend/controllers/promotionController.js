const query = require('./promotionQueryController');
const mutation = require('./promotionMutationController');

module.exports = {
  getCandidates: query.getCandidates,
  promoteStudents: mutation.promoteStudents
};
