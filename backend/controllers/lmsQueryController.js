const LmsItem = require('../models/LmsItem');

const getLmsItems = async (req, res) => {
  try {
    const { item_type, grade_id, section, subject_id, teacher_id, status, search, campus_id } = req.query;
    const query = { school_id: req.schoolId };

    if (campus_id) query.campus_id = campus_id;
    if (item_type) query.item_type = item_type;
    if (grade_id) query.grade_id = grade_id;
    if (section) query.section = section;
    if (subject_id) query.subject_id = subject_id;
    if (teacher_id) query.teacher_id = teacher_id;
    if (status) query.status = status;

    if (search) {
      const q = search.trim();
      query.$or = [{ title: { $regex: q, $options: 'i' } }, { description: { $regex: q, $options: 'i' } }];
    }

    if (req.user?.role === 'Teacher' && !teacher_id && req.query.scope === 'my') {
      query.teacher_id = req.user.id;
    }

    const items = await LmsItem.find(query)
      .populate('grade_id', 'name code')
      .populate('subject_id', 'name code')
      .populate('chapter_id', 'title chapter_no')
      .populate('teacher_id', 'name email')
      .populate('campus_id', 'name')
      .sort({ createdAt: -1 })
      .lean();

    const [allCount, hwCount, matCount, liveCount, quizCount, topics] = await Promise.all([
      LmsItem.countDocuments({ school_id: req.schoolId }),
      LmsItem.countDocuments({ school_id: req.schoolId, item_type: 'Homework', status: 'Active' }),
      LmsItem.countDocuments({ school_id: req.schoolId, item_type: 'Lecture_Material' }),
      LmsItem.countDocuments({ school_id: req.schoolId, item_type: 'Live_Class', status: { $in: ['Active', 'In_Progress'] } }),
      LmsItem.countDocuments({ school_id: req.schoolId, item_type: 'Quiz' }),
      LmsItem.find({ school_id: req.schoolId, item_type: 'Course_Topic' }).select('status').lean()
    ]);

    const completedTopics = topics.filter((t) => t.status === 'Completed').length;
    const syllabusCompletionPct = topics.length > 0 ? Math.round((completedTopics / topics.length) * 100) : 0;

    res.status(200).json({
      success: true,
      items,
      counters: {
        totalItems: allCount,
        activeHomework: hwCount,
        studyMaterials: matCount,
        liveClasses: liveCount,
        onlineQuizzes: quizCount,
        syllabusCompletionPct
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSingleLmsItem = async (req, res) => {
  try {
    const item = await LmsItem.findOne({ _id: req.params.id, school_id: req.schoolId })
      .populate('grade_id', 'name code')
      .populate('subject_id', 'name code')
      .populate('chapter_id', 'title chapter_no')
      .populate('teacher_id', 'name email');

    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    res.status(200).json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getLmsItems, getSingleLmsItem };
