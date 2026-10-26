const ChatConversation = require('../models/ChatConversation');
const UserSession = require('../models/UserSession');
const { buildConversationQuery, mapConversationCard } = require('../utils/chatQueryHelper');

const getConversations = async (req, res) => {
  try {
    const schoolId = req.user.school_id;
    const userId = req.user.id;
    const { filter = 'all', search = '' } = req.query;

    const query = buildConversationQuery({ schoolId, userId, filter, search });

    const conversations = await ChatConversation.find(query)
      .sort({ last_message_at: -1 })
      .limit(100)
      .lean();

    const activeThreshold = new Date(Date.now() - 3 * 60 * 1000);
    const activeSessions = await UserSession.find({
      status: 'Active',
      last_active: { $gte: activeThreshold }
    }).select('user_id').lean();
    const onlineUserIds = new Set(activeSessions.map((s) => String(s.user_id)));

    const mapped = conversations
      .map((c) => mapConversationCard(c, userId, onlineUserIds))
      .sort((a, b) => (b.is_pinned ? 1 : 0) - (a.is_pinned ? 1 : 0));
    res.status(200).json({ success: true, data: mapped });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to load conversations', error: error.message });
  }
};

const createOrGetDirect = async (req, res) => {
  try {
    const schoolId = req.user.school_id;
    const userId = req.user.id;
    const { target_user_id, target_model = 'User', target_name, target_role, target_avatar } = req.body;

    if (!target_user_id) return res.status(400).json({ success: false, message: 'Target user is required' });

    let conv = await ChatConversation.findOne({
      school_id: schoolId,
      is_group: false,
      $and: [
        { 'participants.user_id': userId },
        { 'participants.user_id': target_user_id }
      ]
    });

    if (!conv) {
      conv = await ChatConversation.create({
        school_id: schoolId,
        campus_id: req.user.campus_id,
        is_group: false,
        group_type: 'Direct',
        created_by: userId,
        participants: [
          {
            user_id: userId,
            user_model: req.user.role === 'Student' ? 'Student' : 'User',
            name: req.user.name,
            role_label: req.user.designation || req.user.role || 'Staff',
            avatar_url: req.user.photo_url || ''
          },
          {
            user_id: target_user_id,
            user_model: target_model,
            name: target_name || 'Member',
            role_label: target_role || 'Staff',
            avatar_url: target_avatar || ''
          }
        ]
      });
    }

    res.status(200).json({ success: true, data: conv });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create conversation', error: error.message });
  }
};

const toggleFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const conv = await ChatConversation.findOne({ _id: id, school_id: req.user.school_id });
    if (!conv) return res.status(404).json({ success: false, message: 'Conversation not found' });

    const p = conv.participants.find((item) => String(item.user_id) === String(userId));
    if (!p) return res.status(403).json({ success: false, message: 'Not a participant' });

    p.is_favorite = !p.is_favorite;
    await conv.save();

    res.status(200).json({ success: true, is_favorite: p.is_favorite });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to toggle favorite', error: error.message });
  }
};

module.exports = { getConversations, createOrGetDirect, toggleFavorite };
