const { buildStudentCard, buildAttendanceCard } = require('./slashCommandAcademic');
const { buildDefaultersCard, buildLeaveCard, buildCircularCard } = require('./slashCommandAdmin');

const buildSlashCommandCard = async ({ schoolId, user, commandText }) => {
  const trimmed = (commandText || '').trim();
  if (!trimmed.startsWith('/')) {
    throw new Error('Slash command must begin with a forward slash "/"');
  }

  const spaceIdx = trimmed.indexOf(' ');
  const command = (spaceIdx === -1 ? trimmed : trimmed.slice(0, spaceIdx)).toLowerCase();
  const args = spaceIdx === -1 ? '' : trimmed.slice(spaceIdx + 1).trim();

  switch (command) {
    case '/student':
      return await buildStudentCard(schoolId, args);

    case '/attendance':
      return await buildAttendanceCard(schoolId, args);

    case '/defaulters':
      return await buildDefaultersCard(schoolId, user, args);

    case '/leave': {
      const firstSpace = args.indexOf(' ');
      const days = firstSpace === -1 ? args : args.slice(0, firstSpace);
      const reason = firstSpace === -1 ? '' : args.slice(firstSpace + 1);
      return await buildLeaveCard(schoolId, user, days, reason);
    }

    case '/circular':
      return buildCircularCard(user, args);

    default:
      throw new Error(`Unknown slash command: "${command}". Available commands: /student, /attendance, /defaulters, /leave, /circular`);
  }
};

module.exports = { buildSlashCommandCard };
