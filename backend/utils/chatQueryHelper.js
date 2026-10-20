const escapeRegex = (str = '') => String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const buildConversationQuery = ({ schoolId, userId, filter = 'all', search = '' }) => {
  const query = {
    school_id: schoolId,
    'participants.user_id': userId
  };

  if (filter === 'unread') {
    query.participants = {
      $elemMatch: { user_id: userId, unread_count: { $gt: 0 } }
    };
  } else if (filter === 'favorites') {
    query.participants = {
      $elemMatch: { user_id: userId, is_favorite: true }
    };
  } else if (filter === 'groups') {
    query.is_group = true;
  }

  if (search && String(search).trim()) {
    const escaped = escapeRegex(String(search).trim());
    const regex = new RegExp(escaped, 'i');
    query.$or = [
      { group_name: regex },
      { last_message_text: regex },
      { 'participants.name': regex }
    ];
  }

  return query;
};

const mapConversationCard = (c, userId, onlineUserIds = new Set()) => {
  const myPart = c.participants.find((p) => String(p.user_id) === String(userId)) || {};
  const otherPart = c.participants.find((p) => String(p.user_id) !== String(userId)) || myPart;
  const isOnline = !c.is_group && otherPart.user_id ? onlineUserIds.has(String(otherPart.user_id)) : false;
  return {
    _id: c._id,
    is_group: c.is_group,
    group_name: c.group_name,
    group_type: c.group_type,
    grade_id: c.grade_id,
    section: c.section,
    title: c.is_group ? c.group_name : otherPart.name || 'Direct Chat',
    subtitle: c.is_group ? `${c.participants.length} members` : otherPart.role_label || 'Staff',
    avatar_url: c.is_group ? (c.avatar_url || '') : otherPart.avatar_url || '',
    other_user_id: c.is_group ? null : otherPart.user_id,
    is_online: isOnline,
    unread_count: myPart.unread_count || 0,
    is_favorite: Boolean(myPart.is_favorite),
    is_pinned: Boolean(myPart.is_pinned),
    is_muted: Boolean(myPart.is_muted),
    disappearing_messages: Boolean(c.disappearing_messages),
    last_message_text: c.last_message_text || '',
    last_message_at: c.last_message_at || c.updatedAt,
    participants_count: c.participants.length
  };
};

module.exports = {
  escapeRegex,
  buildConversationQuery,
  mapConversationCard
};
